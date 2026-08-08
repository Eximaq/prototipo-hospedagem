"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Home,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { DateRangeSelector } from "@/components/availability/date-range-selector";
import { GuestSelector } from "@/components/booking/guest-selector";
import { ResponsibleGuestForm } from "@/components/booking/responsible-guest-form";
import {
  compareISODate,
  getTodayISO,
} from "@/lib/availability/date-utils";
import {
  isRangeAvailableFromRanges,
} from "@/lib/availability/merge";
import { birthDateInputToISO, formatBirthDateInput } from "@/lib/birth-date";
import { formatCPF, isValidCPF } from "@/lib/cpf";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  AvailabilityRange,
  PublicHouseAvailability,
} from "@/lib/availability/types";

export type BookingHouseOption = {
  id: string;
  slug: string;
  label: string;
  name: string;
  locationLabel: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  pool: boolean;
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

type FormErrors = Partial<Record<keyof FormState | "guests" | "calendar", string>>;

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

  const guests = form.adults + form.children;
  const isHorizontal = layout === "horizontal";
  const today = getTodayISO();

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
    setForm((current) => ({
      ...current,
      houseSlug: value,
      checkIn: "",
      checkOut: "",
    }));
    setErrors((current) => ({ ...current, houseSlug: undefined, calendar: undefined }));
  }

  function updateGuests(field: "adults" | "children", value: number) {
    updateField(field, Number.isFinite(value) ? value : 0);
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
    if (form.checkIn && compareISODate(form.checkIn, today) < 0) {
      nextErrors.checkIn = "A entrada não pode ser uma data passada.";
    }
    if (form.checkOut && compareISODate(form.checkOut, today) < 0) {
      nextErrors.checkOut = "A saída não pode ser uma data passada.";
    }
    if (form.checkIn && form.checkOut && compareISODate(form.checkOut, form.checkIn) <= 0) {
      nextErrors.checkOut = "A saída deve ser posterior à entrada.";
    }
    if (
      form.checkIn &&
      form.checkOut &&
      !isRangeAvailableFromRanges(form.checkIn, form.checkOut, unavailableRanges)
    ) {
      nextErrors.calendar = "Esse intervalo atravessa uma data indisponível.";
    }
    if (form.adults < 1) nextErrors.adults = "Informe pelo menos 1 adulto.";
    if (form.children < 0) nextErrors.children = "Informe uma quantidade válida.";
    if (selectedHouse && guests > selectedHouse.guests) {
      nextErrors.guests = `Esta casa aceita até ${selectedHouse.guests} hóspedes.`;
    }
    if (form.responsibleName.trim().split(/\s+/).length < 2) {
      nextErrors.responsibleName = "Informe o nome completo do responsável.";
    }
    if (!isValidCPF(form.cpf)) {
      nextErrors.cpf = "Informe um CPF válido.";
    }
    if (!birthDateISO) {
      nextErrors.birthDate = "Informe a data de nascimento.";
    } else if (compareISODate(birthDateISO, today) >= 0) {
      nextErrors.birthDate = "A data de nascimento deve ser anterior a hoje.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || !selectedHouse) return;
    const birthDateISO = birthDateInputToISO(form.birthDate);
    if (!birthDateISO) return;

    window.open(
      buildWhatsAppUrl({
        property: selectedHouse.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        adults: form.adults,
        children: form.children,
        responsibleName: form.responsibleName,
        cpf: form.cpf,
        birthDate: birthDateISO,
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
            Escolha datas disponíveis e envie uma solicitação completa pelo WhatsApp.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.78fr)] xl:items-start">
        <div className="grid gap-4">
          <label className="text-sm font-semibold text-[var(--color-ink)]">
            Casa
            <span className="mt-1.5 flex min-h-11 items-center gap-2 border border-[var(--color-line)] bg-[var(--color-shell)] px-3">
              <Home aria-hidden="true" className="shrink-0 text-[var(--color-copper)]" size={16} />
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
            onChange={(range) => {
              updateField("checkIn", range.checkIn);
              updateField("checkOut", range.checkOut);
            }}
            error={errors.calendar || errors.checkIn || errors.checkOut}
          />

          {selectedHouse ? <SelectedHouseSummary house={selectedHouse} /> : null}
        </div>

        <div className="grid gap-4">
          <GuestSelector
            adults={form.adults}
            childGuests={form.children}
            maxGuests={selectedHouse?.guests || 0}
            errors={{
              adults: errors.adults,
              children: errors.children,
              guests: errors.guests,
            }}
            inputClassName={inputClass}
            onChange={updateGuests}
          />

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
            onChange={updateResponsibleField}
          />

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-ocean-strong)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-copper)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Enviar para o WhatsApp
          </button>
        </div>
      </div>
    </form>
  );
}

function SelectedHouseSummary({ house }: { house: BookingHouseOption }) {
  const facts = [
    {
      label: `Até ${house.guests} hóspedes`,
      icon: Users,
    },
    {
      label: `${house.bedrooms} quartos`,
      icon: BedDouble,
    },
    {
      label: `${house.bathrooms} banheiros`,
      icon: Bath,
    },
    {
      label: house.pool ? "Piscina privativa" : "Sem piscina",
      icon: Waves,
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
            <Icon aria-hidden="true" className="shrink-0 text-[var(--color-copper)]" size={16} />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 border-t border-[var(--color-line)] pt-3 text-sm text-[var(--color-muted)]">
        <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-ocean-strong)]" size={16} />
        <span>{house.locationLabel}</span>
      </div>

      {house.highlights.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {house.highlights.map((highlight) => (
            <span
              key={highlight}
              className="inline-flex items-center gap-1.5 bg-[var(--color-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)]"
            >
              <Sparkles aria-hidden="true" size={13} className="text-[var(--color-copper)]" />
              {highlight}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
