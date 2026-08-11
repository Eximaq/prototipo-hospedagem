"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Flame,
  Home,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import { DateRangeSelector } from "@/components/availability/date-range-selector";
import { GuestSelector } from "@/components/booking/guest-selector";
import { ResponsibleGuestForm } from "@/components/booking/responsible-guest-form";
import {
  calculateNights,
  compareISODate,
  formatDateForDisplay,
  getTodayISO,
  isISODate,
} from "@/lib/availability/date-utils";
import { trackEvent } from "@/lib/analytics";
import { isRangeAvailableFromRanges } from "@/lib/availability/merge";
import { birthDateInputToISO, formatBirthDateInput } from "@/lib/birth-date";
import { formatCPF, isValidCPF } from "@/lib/cpf";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { AvailabilityRange, PublicHouseAvailability } from "@/lib/availability/types";

export type BookingHouseOption = {
  id: string;
  slug: string;
  label: string;
  name: string;
  locationLabel: string;
  guests: number | null;
  minNights: number;
  maxNights?: number | null;
  suites: number;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
  barbecue: boolean;
  highlights: string[];
};

type FormState = {
  houseSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  responsibleName: string;
  cpf: string;
  birthDate: string;
  notes: string;
};

type PrefillDetail = Partial<
  Pick<FormState, "houseSlug" | "checkIn" | "checkOut" | "adults" | "children">
>;

type FormErrors = Partial<Record<keyof FormState | "guests" | "calendar", string>>;

function formatNightCount(count: number) {
  return `${count} noite${count === 1 ? "" : "s"}`;
}

function getStayRuleLabel(house?: BookingHouseOption) {
  if (!house) return "";
  if (house.maxNights && house.minNights === house.maxNights) {
    return `Regra da casa: ${formatNightCount(house.minNights)}.`;
  }
  if (house.maxNights) {
    return `Regra da casa: ${formatNightCount(house.minNights)} a ${formatNightCount(house.maxNights)}.`;
  }
  return `Regra da casa: mínimo de ${formatNightCount(house.minNights)}.`;
}

function getStayRuleError(house: BookingHouseOption | undefined, nights: number) {
  if (!house || !nights) return undefined;
  if (nights < house.minNights) {
    return `A ${house.name} exige no mínimo ${formatNightCount(house.minNights)}.`;
  }
  if (house.maxNights && nights > house.maxNights) {
    return `A ${house.name} permite até ${formatNightCount(house.maxNights)} por consulta online.`;
  }
  return undefined;
}

function getGuestRuleError(house: BookingHouseOption | undefined, totalGuests: number) {
  if (!house?.guests || totalGuests <= house.guests) return undefined;
  return `A ${house.name} recebe até ${house.guests} hóspedes.`;
}

function normalizeGuestCountsForHouse(
  adults: number,
  children: number,
  house?: BookingHouseOption,
) {
  const safeAdults = Math.max(1, Math.trunc(adults) || 1);
  const safeChildren = Math.max(0, Math.trunc(children) || 0);

  if (!house?.guests) {
    return { adults: safeAdults, children: safeChildren };
  }

  const cappedAdults = Math.min(safeAdults, house.guests);
  return {
    adults: cappedAdults,
    children: Math.min(safeChildren, Math.max(0, house.guests - cappedAdults)),
  };
}

export function AvailabilityForm({
  selectedHouseSlug,
  title = "Consultar disponibilidade",
  layout = "stacked",
  houses,
  availability,
}: {
  selectedHouseSlug?: string;
  title?: string;
  layout?: "stacked" | "horizontal";
  houses: BookingHouseOption[];
  availability: PublicHouseAvailability[];
}) {
  const initialHouseSlug = selectedHouseSlug || houses[0]?.slug || "";
  const [form, setForm] = useState<FormState>({
    houseSlug: initialHouseSlug,
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    responsibleName: "",
    cpf: "",
    birthDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreReservationFields, setShowPreReservationFields] = useState(false);

  useEffect(() => {
    function applyPrefill(detail: PrefillDetail) {
      const validHouseSlug =
        detail.houseSlug && houses.some((house) => house.slug === detail.houseSlug)
          ? detail.houseSlug
          : undefined;
      setForm((current) => {
        const nextHouseSlug = validHouseSlug || current.houseSlug;
        const nextHouse = houses.find((house) => house.slug === nextHouseSlug);
        const guests = normalizeGuestCountsForHouse(
          typeof detail.adults === "number" && Number.isFinite(detail.adults)
            ? detail.adults
            : current.adults,
          typeof detail.children === "number" && Number.isFinite(detail.children)
            ? detail.children
            : current.children,
          nextHouse,
        );

        return {
          ...current,
          ...guests,
          houseSlug: nextHouseSlug,
          checkIn: detail.checkIn || current.checkIn,
          checkOut: detail.checkOut || current.checkOut,
        };
      });
    }

    const params = new URLSearchParams(window.location.search);
    const prefillFromUrl: PrefillDetail = {
      houseSlug: params.get("casa") || params.get("house") || undefined,
      checkIn: params.get("checkIn") || undefined,
      checkOut: params.get("checkOut") || undefined,
      adults: params.get("adults") ? Number(params.get("adults")) : undefined,
      children: params.get("children") ? Number(params.get("children")) : undefined,
    };

    if (Object.values(prefillFromUrl).some((value) => value !== undefined)) {
      applyPrefill(prefillFromUrl);
    }

    function onPrefill(event: Event) {
      applyPrefill((event as CustomEvent<PrefillDetail>).detail || {});
    }

    window.addEventListener("booking-prefill", onPrefill);
    return () => window.removeEventListener("booking-prefill", onPrefill);
  }, [houses]);

  const selectedHouse = useMemo(
    () => houses.find((house) => house.slug === form.houseSlug),
    [form.houseSlug, houses],
  );

  const unavailableRanges = useMemo<AvailabilityRange[]>(() => {
    if (!selectedHouse) return [];
    return (
      availability.find((entry) => entry.houseId === selectedHouse.id)?.unavailableRanges ||
      []
    );
  }, [availability, selectedHouse]);

  const isHorizontal = layout === "horizontal";
  const today = getTodayISO();
  const nights = calculateNights(form.checkIn, form.checkOut);
  const totalGuests = form.adults + form.children;
  const hasValidRange = Boolean(
    form.checkIn &&
    form.checkOut &&
    isISODate(form.checkIn) &&
    isISODate(form.checkOut) &&
    compareISODate(form.checkOut, form.checkIn) > 0,
  );
  const hasAvailabilityConflict = Boolean(
    hasValidRange &&
    !isRangeAvailableFromRanges(form.checkIn, form.checkOut, unavailableRanges),
  );
  const stayRuleLabel = getStayRuleLabel(selectedHouse);
  const stayRuleError = hasValidRange ? getStayRuleError(selectedHouse, nights) : undefined;
  const guestRuleError = getGuestRuleError(selectedHouse, totalGuests);
  const canContinueToContact = Boolean(
    selectedHouse &&
    hasValidRange &&
    !hasAvailabilityConflict &&
    !stayRuleError &&
    !guestRuleError &&
    form.adults >= 1 &&
    form.children >= 0,
  );

  useEffect(() => {
    if (!hasValidRange || !selectedHouse) return;
    trackEvent(hasAvailabilityConflict ? "availability_conflict" : "availability_success", {
      houseSlug: selectedHouse.slug,
      nights,
    });
  }, [hasAvailabilityConflict, hasValidRange, nights, selectedHouse]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
      guests: undefined,
      calendar: undefined,
    }));
  }

  function updateHouseSlug(value: string) {
    trackEvent("select_house", { houseSlug: value });
    const nextHouse = houses.find((house) => house.slug === value);
    setForm((current) => ({
      ...current,
      ...normalizeGuestCountsForHouse(current.adults, current.children, nextHouse),
      houseSlug: value,
      checkIn: "",
      checkOut: "",
    }));
    setErrors((current) => ({ ...current, houseSlug: undefined, calendar: undefined }));
  }

  function updateGuests(field: "adults" | "children", value: number) {
    const baseValue = Number.isFinite(value) ? Math.trunc(value) : 0;

    setForm((current) => {
      const guests = normalizeGuestCountsForHouse(
        field === "adults" ? baseValue : current.adults,
        field === "children" ? baseValue : current.children,
        selectedHouse,
      );
      return {
        ...current,
        ...guests,
      };
    });
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      guests: undefined,
    }));
  }

  function updateResponsibleField(
    field: "responsibleName" | "cpf" | "birthDate" | "notes",
    value: string,
  ) {
    const formattedValue =
      field === "cpf"
        ? formatCPF(value)
        : field === "birthDate"
          ? formatBirthDateInput(value)
          : value;

    updateField(field, formattedValue);
  }

  function validate() {
    const nextErrors: FormErrors = {};
    const birthDateISO = birthDateInputToISO(form.birthDate);

    if (!form.houseSlug || !selectedHouse) nextErrors.houseSlug = "Selecione uma casa.";
    if (!form.checkIn) nextErrors.checkIn = "Selecione a data de entrada.";
    if (!form.checkOut) nextErrors.checkOut = "Selecione a data de saída.";
    if (form.checkIn && !isISODate(form.checkIn)) {
      nextErrors.checkIn = "Selecione uma data de entrada válida.";
    }
    if (form.checkOut && !isISODate(form.checkOut)) {
      nextErrors.checkOut = "Selecione uma data de saída válida.";
    }
    if (
      form.checkIn &&
      isISODate(form.checkIn) &&
      compareISODate(form.checkIn, today) < 0
    ) {
      nextErrors.checkIn = "A entrada não pode ser uma data passada.";
    }
    if (
      form.checkOut &&
      isISODate(form.checkOut) &&
      compareISODate(form.checkOut, today) < 0
    ) {
      nextErrors.checkOut = "A saída não pode ser uma data passada.";
    }
    if (
      form.checkIn &&
      form.checkOut &&
      isISODate(form.checkIn) &&
      isISODate(form.checkOut) &&
      compareISODate(form.checkOut, form.checkIn) <= 0
    ) {
      nextErrors.checkOut = "A saída deve ser posterior à entrada.";
    }
    if (
      form.checkIn &&
      form.checkOut &&
      isISODate(form.checkIn) &&
      isISODate(form.checkOut) &&
      !isRangeAvailableFromRanges(form.checkIn, form.checkOut, unavailableRanges)
    ) {
      nextErrors.calendar = "Esse intervalo atravessa uma data indisponível.";
    }
    const stayError = getStayRuleError(selectedHouse, nights);
    if (stayError) nextErrors.calendar = stayError;
    if (form.adults < 1) nextErrors.adults = "Informe pelo menos 1 adulto.";
    if (form.children < 0) nextErrors.children = "Informe uma quantidade válida.";
    const guestError = getGuestRuleError(selectedHouse, totalGuests);
    if (guestError) nextErrors.guests = guestError;
    if (form.responsibleName.trim().split(/\s+/).length < 2) {
      nextErrors.responsibleName = "Informe seu nome completo.";
    }
    if (showPreReservationFields || form.cpf.trim()) {
      if (!isValidCPF(form.cpf)) {
        nextErrors.cpf = "Informe um CPF válido.";
      }
    }
    if (showPreReservationFields || form.birthDate.trim()) {
      if (!birthDateISO) {
        nextErrors.birthDate = "Informe a data no formato dd/mm/aaaa.";
      } else if (compareISODate(birthDateISO, today) >= 0) {
        nextErrors.birthDate = "A data de nascimento deve ser anterior a hoje.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || !selectedHouse) return;
    const birthDateISO = birthDateInputToISO(form.birthDate);

    trackEvent("click_whatsapp", {
      houseSlug: selectedHouse.slug,
      nights,
      adults: form.adults,
      children: form.children,
    });
    window.open(
      buildWhatsAppUrl({
        property: selectedHouse.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        adults: form.adults,
        children: form.children,
        responsibleName: form.responsibleName,
        cpf: form.cpf || undefined,
        birthDate: birthDateISO || undefined,
        notes: form.notes,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const inputClass =
    "mt-1.5 min-h-11 w-full rounded-sm border border-[var(--color-line)] bg-[var(--color-shell)] px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-copper)] focus:ring-2 focus:ring-[var(--color-copper)]/20";

  return (
    <form
      onSubmit={onSubmit}
      className={
        isHorizontal
          ? "border border-[var(--color-line)] bg-[var(--color-shell)] p-3 shadow-[0_18px_45px_rgba(23,35,34,0.10)] md:p-4"
          : "border border-[var(--color-line)] bg-[var(--color-shell)] p-4 shadow-[0_18px_45px_rgba(23,35,34,0.10)] md:p-5"
      }
      noValidate
    >
      <div className="flex items-start gap-3 border-b border-[var(--color-line)] pb-4">
        <span className="grid size-10 shrink-0 place-items-center bg-[var(--color-ocean-strong)] text-white">
          <CalendarDays aria-hidden="true" size={19} />
        </span>
        <div>
          <h2 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
            Escolha casa, datas e hóspedes. Depois envie a consulta pelo WhatsApp.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.78fr)] xl:items-start">
        <div className="grid gap-4">
          <label className="text-sm font-semibold text-[var(--color-ink)]">
            Casa
            <span className="mt-1.5 flex min-h-11 items-center gap-2 border border-[var(--color-line)] bg-[var(--color-shell)] px-3">
              <Home
                aria-hidden="true"
                className="shrink-0 text-[var(--color-copper)]"
                size={16}
              />
              <select
                className="h-10 w-full bg-transparent text-sm text-[var(--color-ink)] outline-none"
                value={form.houseSlug}
                onChange={(event) => updateHouseSlug(event.target.value)}
                aria-invalid={Boolean(errors.houseSlug)}
                aria-describedby={errors.houseSlug ? "house-error" : undefined}
              >
                {houses.map((house) => (
                  <option value={house.slug} key={house.id}>
                    {house.label} - {house.name}
                  </option>
                ))}
              </select>
            </span>
            {errors.houseSlug ? (
              <span className="mt-2 block text-sm text-red-700" id="house-error">
                {errors.houseSlug}
              </span>
            ) : null}
          </label>

          <DateRangeSelector
            unavailableRanges={unavailableRanges}
            checkIn={form.checkIn}
            checkOut={form.checkOut}
            minNights={selectedHouse?.minNights ?? null}
            maxNights={selectedHouse?.maxNights ?? null}
            stayRuleLabel={stayRuleLabel}
            onChange={(range) => {
              if (range.checkIn && !form.checkIn) {
                trackEvent("select_checkin", { houseSlug: form.houseSlug });
              }
              if (range.checkOut && !form.checkOut) {
                trackEvent("select_checkout", { houseSlug: form.houseSlug });
              }
              updateField("checkIn", range.checkIn);
              updateField("checkOut", range.checkOut);
            }}
            onInvalidStay={(invalidNights) => {
              setErrors((current) => ({
                ...current,
                calendar:
                  getStayRuleError(selectedHouse, invalidNights) ||
                  `Selecione um período compatível com ${selectedHouse?.name || "a casa"}.`,
              }));
            }}
            error={errors.calendar || errors.checkIn || errors.checkOut || stayRuleError}
          />

          <BookingSelectionSummary
            houseName={selectedHouse?.name}
            checkIn={form.checkIn}
            checkOut={form.checkOut}
            nights={nights}
            adults={form.adults}
            childGuests={form.children}
            hasValidRange={hasValidRange}
            hasAvailabilityConflict={hasAvailabilityConflict}
            stayRuleLabel={stayRuleLabel}
            stayRuleError={stayRuleError}
          />

          {selectedHouse ? <SelectedHouseSummary house={selectedHouse} /> : null}
        </div>

        <div className="grid gap-4">
          <GuestSelector
            adults={form.adults}
            childGuests={form.children}
            maxGuests={selectedHouse?.guests ?? null}
            errors={{
              adults: errors.adults,
              children: errors.children,
              guests: errors.guests || guestRuleError,
            }}
            inputClassName={inputClass}
            onChange={updateGuests}
          />

          {canContinueToContact ? (
            <ResponsibleGuestForm
              responsibleName={form.responsibleName}
              cpf={form.cpf}
              birthDate={form.birthDate}
              notes={form.notes}
              errors={{
                responsibleName: errors.responsibleName,
                cpf: errors.cpf,
                birthDate: errors.birthDate,
              }}
              inputClassName={inputClass}
              showPreReservationFields={showPreReservationFields}
              onTogglePreReservation={() =>
                setShowPreReservationFields((current) => !current)
              }
              onChange={updateResponsibleField}
            />
          ) : (
            <div className="border border-[var(--color-line)] bg-white/55 p-4">
              <p className="flex gap-2 text-sm font-semibold text-[var(--color-ink)]">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-ocean)]"
                  size={17}
                />
                Selecione um período válido para continuar.
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Primeiro confirme casa, entrada, saída e hóspedes. Depois pedimos apenas os
                dados necessários para iniciar a conversa no WhatsApp.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canContinueToContact}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-ocean-strong)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:bg-[var(--color-muted)]/45 disabled:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Consultar disponibilidade
          </button>
        </div>
      </div>
    </form>
  );
}

function BookingSelectionSummary({
  houseName,
  checkIn,
  checkOut,
  nights,
  adults,
  childGuests,
  hasValidRange,
  hasAvailabilityConflict,
  stayRuleLabel,
  stayRuleError,
}: {
  houseName?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  childGuests: number;
  hasValidRange: boolean;
  hasAvailabilityConflict: boolean;
  stayRuleLabel: string;
  stayRuleError?: string;
}) {
  const totalGuests = adults + childGuests;
  const statusError =
    stayRuleError ||
    (hasAvailabilityConflict
      ? "Uma ou mais datas deste período estão indisponíveis. Escolha outro período."
      : undefined);

  return (
    <div className="border border-[var(--color-line)] bg-white/50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryItem label="Casa" value={houseName || "Escolha uma casa"} />
        <SummaryItem
          label="Período"
          value={
            checkIn && checkOut
              ? `${formatDateForDisplay(checkIn)} a ${formatDateForDisplay(checkOut)}`
              : "Escolha entrada e saída"
          }
        />
        <SummaryItem
          label="Estadia"
          value={nights ? `${nights} noite${nights === 1 ? "" : "s"}` : "Aguardando datas"}
        />
        <SummaryItem
          label="Regra"
          value={
            stayRuleLabel.replace("Regra da casa: ", "").replace(".", "") ||
            "Conforme a casa"
          }
        />
        <SummaryItem
          label="Hóspedes"
          value={`${totalGuests} hóspede${totalGuests === 1 ? "" : "s"}`}
        />
      </div>
      {hasValidRange ? (
        <p
          className={`mt-4 flex gap-2 text-sm font-semibold ${
            statusError ? "text-red-700" : "text-[var(--color-ocean-strong)]"
          }`}
          aria-live="polite"
        >
          {statusError ? (
            <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
          )}
          {statusError || "Período disponível para consulta."}
        </p>
      ) : null}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-5 text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

function SelectedHouseSummary({ house }: { house: BookingHouseOption }) {
  const facts = [
    {
      label: getStayRuleLabel(house).replace("Regra da casa: ", "").replace(".", ""),
      icon: CalendarDays,
    },
    {
      label: house.guests ? `Até ${house.guests} hóspedes` : "Capacidade a confirmar",
      icon: Users,
    },
    {
      label: `${house.suites} suítes`,
      icon: Home,
    },
    {
      label: "Wi-Fi disponível",
      icon: Wifi,
    },
    {
      label: house.pool ? "Piscina privativa" : "Sem piscina",
      icon: Waves,
    },
    {
      label: house.barbecue ? "Churrasqueira" : "Churrasqueira a confirmar",
      icon: Flame,
    },
  ];

  return (
    <div className="border-l-2 border-[var(--color-copper)] bg-white/45 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-copper)]">
            Resumo da casa
          </p>
          <h3 className="mt-1 font-serif text-xl leading-tight text-[var(--color-ink)]">
            {house.label} - {house.name}
          </h3>
        </div>
        <span className="grid size-9 shrink-0 place-items-center bg-[var(--color-ocean-strong)] text-white">
          <Home aria-hidden="true" size={17} />
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {facts.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-[var(--color-ink)]"
          >
            <Icon
              aria-hidden="true"
              className="shrink-0 text-[var(--color-copper)]"
              size={16}
            />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 border-t border-[var(--color-line)] pt-3 text-sm text-[var(--color-muted)]">
        <MapPin
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--color-ocean-strong)]"
          size={16}
        />
        <span>{house.locationLabel}</span>
      </div>

      {house.highlights.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {house.highlights.map((highlight) => (
            <span
              key={highlight}
              className="inline-flex items-center gap-1.5 bg-[var(--color-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)]"
            >
              <Sparkles
                aria-hidden="true"
                size={13}
                className="text-[var(--color-copper)]"
              />
              {highlight}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
