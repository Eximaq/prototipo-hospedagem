"use client";

import { Users } from "lucide-react";
import {
  getGuestTotal,
  parseNumericInputValue,
  type NumericInputValue,
} from "@/lib/guest-count";

type GuestSelectorProps = {
  adults: NumericInputValue;
  childGuests: NumericInputValue;
  maxGuests?: number | null;
  errors: {
    adults?: string;
    children?: string;
    guests?: string;
  };
  inputClassName: string;
  onChange: (field: "adults" | "children", value: NumericInputValue) => void;
  onBlur: (field: "adults" | "children") => void;
};

export function GuestSelector({
  adults,
  childGuests,
  maxGuests,
  errors,
  inputClassName,
  onChange,
  onBlur,
}: GuestSelectorProps) {
  const totalGuests = getGuestTotal(adults, childGuests);
  const adultCount = adults === "" ? 0 : Math.max(0, adults);
  const childCount = childGuests === "" ? 0 : Math.max(0, childGuests);
  const maxAdults = maxGuests ? Math.max(1, maxGuests - childCount) : undefined;
  const maxChildren = maxGuests ? Math.max(0, maxGuests - adultCount) : undefined;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <GuestCountField
        label="Adultos"
        name="adults"
        value={adults}
        minimum={1}
        maximum={maxAdults}
        error={errors.adults}
        inputClassName={inputClassName}
        onChange={(value) => onChange("adults", value)}
        onBlur={() => onBlur("adults")}
      />

      <GuestCountField
        label="Crianças"
        name="children"
        value={childGuests}
        minimum={0}
        maximum={maxChildren}
        error={errors.children}
        inputClassName={inputClassName}
        onChange={(value) => onChange("children", value)}
        onBlur={() => onBlur("children")}
      />

      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] sm:col-span-2">
        <Users aria-hidden="true" size={17} />
        <span>
          {totalGuests === null
            ? "Quantidade de hóspedes em edição"
            : maxGuests
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

function GuestCountField({
  label,
  name,
  value,
  minimum,
  maximum,
  error,
  inputClassName,
  onChange,
  onBlur,
}: {
  label: string;
  name: "adults" | "children";
  value: NumericInputValue;
  minimum: number;
  maximum?: number;
  error?: string;
  inputClassName: string;
  onChange: (value: NumericInputValue) => void;
  onBlur: () => void;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="text-sm font-semibold text-[var(--color-ink)]">
      {label}
      <input
        className={inputClassName}
        type="number"
        name={name}
        min={minimum}
        max={maximum}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(parseNumericInputValue(event.currentTarget.value))}
        onBlur={onBlur}
        onFocus={(event) => event.currentTarget.select()}
        aria-label={`Quantidade de ${label.toLocaleLowerCase("pt-BR")}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <span className="mt-2 block text-sm text-red-700" id={errorId} aria-live="polite">
          {error}
        </span>
      ) : null}
    </label>
  );
}
