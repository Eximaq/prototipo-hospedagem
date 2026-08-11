"use client";

import { Users } from "lucide-react";

type GuestSelectorProps = {
  adults: number;
  childGuests: number;
  maxGuests?: number | null;
  errors: {
    adults?: string;
    children?: string;
    guests?: string;
  };
  inputClassName: string;
  onChange: (field: "adults" | "children", value: number) => void;
};

export function GuestSelector({
  adults,
  childGuests,
  maxGuests,
  errors,
  inputClassName,
  onChange,
}: GuestSelectorProps) {
  const totalGuests = adults + childGuests;
  const maxAdults = maxGuests ? Math.max(1, maxGuests - childGuests) : undefined;
  const maxChildren = maxGuests ? Math.max(0, maxGuests - adults) : undefined;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-semibold text-[var(--color-ink)]">
        Adultos
        <input
          className={inputClassName}
          type="number"
          min={1}
          max={maxAdults}
          value={adults}
          onChange={(event) => onChange("adults", Number(event.target.value))}
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
          className={inputClassName}
          type="number"
          min={0}
          max={maxChildren}
          value={childGuests}
          onChange={(event) => onChange("children", Number(event.target.value))}
          aria-invalid={Boolean(errors.children)}
          aria-describedby={errors.children ? "children-error" : undefined}
        />
        {errors.children ? (
          <span className="mt-2 block text-sm text-red-700" id="children-error">
            {errors.children}
          </span>
        ) : null}
      </label>

      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] sm:col-span-2">
        <Users aria-hidden="true" size={17} />
        <span>
          {maxGuests
            ? `${totalGuests} hóspede${totalGuests === 1 ? "" : "s"} de até ${maxGuests}`
            : `${totalGuests} hóspede${totalGuests === 1 ? "" : "s"} para consulta`}
        </span>
      </div>
      {errors.guests ? (
        <p className="text-sm text-red-700 sm:col-span-2" aria-live="polite">
          {errors.guests}
        </p>
      ) : null}
    </div>
  );
}
