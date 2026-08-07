"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageCircle, Users } from "lucide-react";
import { houses } from "@/data/houses";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type FormState = {
  houseSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  notes: string;
};

const storageKey = "casas-milagres-availability";

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export function AvailabilityForm({
  selectedHouseSlug,
  title = "Consultar disponibilidade",
  layout = "stacked",
}: {
  selectedHouseSlug?: string;
  title?: string;
  layout?: "stacked" | "horizontal";
}) {
  const [form, setForm] = useState<FormState>({
    houseSlug: selectedHouseSlug || houses[0]?.slug || "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "guests", string>>>({});

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as FormState;
      queueMicrotask(() => {
        setForm((current) => ({
          ...current,
          ...parsed,
          houseSlug: selectedHouseSlug || parsed.houseSlug || current.houseSlug,
        }));
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [selectedHouseSlug]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form]);

  const selectedHouse = useMemo(
    () => houses.find((house) => house.slug === form.houseSlug),
    [form.houseSlug],
  );

  const guests = form.adults + form.children;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, guests: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState | "guests", string>> = {};
    const minDate = todayIso();

    if (!form.houseSlug || !selectedHouse) nextErrors.houseSlug = "Selecione uma casa.";
    if (!form.checkIn) nextErrors.checkIn = "Informe a data de entrada.";
    if (!form.checkOut) nextErrors.checkOut = "Informe a data de saída.";
    if (form.checkIn && form.checkIn < minDate) {
      nextErrors.checkIn = "A entrada não pode ser uma data passada.";
    }
    if (form.checkOut && form.checkOut < minDate) {
      nextErrors.checkOut = "A saída não pode ser uma data passada.";
    }
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      nextErrors.checkOut = "A saída deve ser posterior à entrada.";
    }
    if (form.adults < 1) nextErrors.adults = "Informe pelo menos 1 adulto.";
    if (selectedHouse && guests > selectedHouse.guests) {
      nextErrors.guests = `Esta casa aceita até ${selectedHouse.guests} hóspedes.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || !selectedHouse) return;

    window.open(
      buildWhatsAppUrl({
        property: selectedHouse.name,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        adults: form.adults,
        children: form.children,
        notes: form.notes,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const inputClass =
    "mt-1.5 min-h-11 w-full rounded-sm border border-[var(--color-line)] bg-[var(--color-shell)] px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-copper)] focus:ring-2 focus:ring-[var(--color-copper)]/20";
  const isHorizontal = layout === "horizontal";

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
      <div
        className={
          isHorizontal
            ? "flex items-start gap-3 border-b border-[var(--color-line)] pb-4 lg:hidden"
            : "flex items-start gap-3 border-b border-[var(--color-line)] pb-4"
        }
      >
        <span className="grid size-10 shrink-0 place-items-center bg-[var(--color-ocean)] text-white">
          <CalendarDays aria-hidden="true" size={19} />
        </span>
        <div>
          <h2 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
            Escolha a casa e envie uma mensagem completa para o atendimento.
          </p>
        </div>
      </div>

      <div
        className={
          isHorizontal
            ? "mt-4 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-[minmax(190px,1.35fr)_minmax(130px,0.85fr)_minmax(130px,0.85fr)_minmax(84px,0.48fr)_minmax(84px,0.48fr)] xl:grid-cols-[minmax(190px,1.08fr)_minmax(122px,0.7fr)_minmax(122px,0.7fr)_minmax(78px,0.42fr)_minmax(78px,0.42fr)_minmax(220px,1.16fr)_auto] xl:items-start"
            : "mt-4 grid gap-3 sm:grid-cols-2"
        }
      >
        <label
          className={
            isHorizontal
              ? "text-sm font-semibold text-[var(--color-ink)] sm:col-span-2 lg:col-span-1"
              : "text-sm font-semibold text-[var(--color-ink)] sm:col-span-2"
          }
        >
          Casa
          <select
            className={inputClass}
            value={form.houseSlug}
            onChange={(event) => updateField("houseSlug", event.target.value)}
            aria-invalid={Boolean(errors.houseSlug)}
            aria-describedby={errors.houseSlug ? "house-error" : undefined}
          >
            {houses.map((house) => (
              <option value={house.slug} key={house.id}>
                {house.label} - {house.name}
              </option>
            ))}
          </select>
          {errors.houseSlug ? (
            <span className="mt-2 block text-sm text-red-700" id="house-error">
              {errors.houseSlug}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-semibold text-[var(--color-ink)]">
          Entrada
          <input
            className={inputClass}
            type="date"
            min={todayIso()}
            value={form.checkIn}
            onChange={(event) => updateField("checkIn", event.target.value)}
            aria-invalid={Boolean(errors.checkIn)}
            aria-describedby={errors.checkIn ? "checkin-error" : undefined}
          />
          {errors.checkIn ? (
            <span className="mt-2 block text-sm text-red-700" id="checkin-error">
              {errors.checkIn}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-semibold text-[var(--color-ink)]">
          Saída
          <input
            className={inputClass}
            type="date"
            min={form.checkIn || todayIso()}
            value={form.checkOut}
            onChange={(event) => updateField("checkOut", event.target.value)}
            aria-invalid={Boolean(errors.checkOut)}
            aria-describedby={errors.checkOut ? "checkout-error" : undefined}
          />
          {errors.checkOut ? (
            <span className="mt-2 block text-sm text-red-700" id="checkout-error">
              {errors.checkOut}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-semibold text-[var(--color-ink)]">
          Adultos
          <input
            className={inputClass}
            type="number"
            min={1}
            value={form.adults}
            onChange={(event) => updateField("adults", Number(event.target.value))}
            aria-invalid={Boolean(errors.adults)}
            aria-describedby={errors.adults ? "adults-error" : undefined}
          />
          {errors.adults ? (
            <span className="mt-2 block text-sm text-red-700" id="adults-error">
              {errors.adults}
            </span>
          ) : null}
        </label>

        <label className="text-sm font-semibold text-[var(--color-ink)]">
          Crianças
          <input
            className={inputClass}
            type="number"
            min={0}
            value={form.children}
            onChange={(event) => updateField("children", Number(event.target.value))}
          />
        </label>

        {isHorizontal ? (
          <>
            <label className="text-sm font-semibold text-[var(--color-ink)] sm:col-span-2 lg:col-span-3 xl:col-span-1">
              Observação opcional
              <input
                className={inputClass}
                type="text"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Valores, condições ou pedido especial."
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 self-end rounded-sm bg-[var(--color-ocean)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] sm:col-span-2 lg:col-span-2 xl:col-span-1 xl:w-auto xl:min-w-56"
            >
              <MessageCircle aria-hidden="true" size={18} />
              Enviar para o WhatsApp
            </button>
          </>
        ) : null}
      </div>

      <div className={isHorizontal ? "mt-3 flex items-center gap-2 text-sm text-[var(--color-muted)] lg:hidden" : "mt-3 flex items-center gap-2 text-sm text-[var(--color-muted)]"}>
        <Users aria-hidden="true" size={17} />
        {selectedHouse ? (
          <span>
            {guests} hóspede{guests === 1 ? "" : "s"} de até {selectedHouse.guests}
          </span>
        ) : null}
      </div>
      {errors.guests ? (
        <p className="mt-2 text-sm text-red-700" aria-live="polite">
          {errors.guests}
        </p>
      ) : null}

      {!isHorizontal ? (
        <>
          <label className="mt-3 block text-sm font-semibold text-[var(--color-ink)]">
            Observação opcional
            <textarea
              className={`${inputClass} min-h-20 resize-y py-3`}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Gostaria de saber valores, condições e disponibilidade."
            />
          </label>

          <button
            type="submit"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-ocean)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Enviar para o WhatsApp
          </button>
        </>
      ) : null}
    </form>
  );
}
