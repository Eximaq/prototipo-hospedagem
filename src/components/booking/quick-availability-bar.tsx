"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, Home, Search, Users, type LucideIcon } from "lucide-react";
import type { BookingHouseOption } from "@/components/booking/availability-form";
import { addDays, calculateNights, getTodayISO } from "@/lib/availability/date-utils";
import { trackEvent } from "@/lib/analytics";
import {
  normalizeGuestCount,
  parseNumericInputValue,
  type NumericInputValue,
} from "@/lib/guest-count";

type QuickAvailabilityBarProps = {
  houses: BookingHouseOption[];
};

export function QuickAvailabilityBar({ houses }: QuickAvailabilityBarProps) {
  const today = getTodayISO();
  const [houseSlug, setHouseSlug] = useState(houses[0]?.slug || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<NumericInputValue>(2);
  const selectedHouse = useMemo(
    () => houses.find((house) => house.slug === houseSlug),
    [houseSlug, houses],
  );
  const minCheckOut = checkIn ? addDays(checkIn, selectedHouse?.minNights ?? 1) : today;
  const maxCheckOut =
    checkIn && selectedHouse?.maxNights
      ? addDays(checkIn, selectedHouse.maxNights)
      : undefined;
  const guestError = getGuestError(guests, selectedHouse);

  function hasInvalidStay(
    nextCheckIn: string,
    nextCheckOut: string,
    house = selectedHouse,
  ) {
    if (!nextCheckIn || !nextCheckOut || !house) return false;
    const nights = calculateNights(nextCheckIn, nextCheckOut);
    return Boolean(
      nights && (nights < house.minNights || (house.maxNights && nights > house.maxNights)),
    );
  }

  function updateHouseSlug(value: string) {
    const nextHouse = houses.find((house) => house.slug === value);
    setHouseSlug(value);
    if (nextHouse?.guests) {
      setGuests((current) =>
        Math.min(normalizeGuestCount(current, 1), nextHouse.guests || 1),
      );
    }
    if (nextHouse && hasInvalidStay(checkIn, checkOut, nextHouse)) setCheckOut("");
  }

  function updateCheckIn(value: string) {
    setCheckIn(value);
    if (hasInvalidStay(value, checkOut)) setCheckOut("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedGuests = normalizeGuestCount(guests, 1);
    setGuests(normalizedGuests);

    if (getGuestError(normalizedGuests, selectedHouse)) return;

    const detail = {
      houseSlug,
      checkIn,
      checkOut,
      adults: normalizedGuests,
      children: 0,
    };

    trackEvent("start_booking", {
      houseSlug,
      hasCheckIn: Boolean(checkIn),
      hasCheckOut: Boolean(checkOut),
      guests: normalizedGuests,
    });

    window.dispatchEvent(new CustomEvent("booking-prefill", { detail }));

    const params = new URLSearchParams();
    if (houseSlug) params.set("casa", houseSlug);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", String(normalizedGuests));

    const nextUrl = `/?${params.toString()}#consultar`;
    window.history.replaceState(null, "", nextUrl);
    document.getElementById("consultar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-8 grid max-w-5xl gap-2 border border-white/18 bg-[var(--color-shell)]/95 p-2 text-left text-[var(--color-ink)] shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur md:grid-cols-[1.25fr_1fr_1fr_0.82fr_auto]"
    >
      <QuickField label="Casa" icon={Home}>
        <select
          value={houseSlug}
          onChange={(event) => updateHouseSlug(event.target.value)}
          className="w-full bg-transparent text-base font-semibold outline-none md:text-sm"
          aria-label="Escolher casa"
        >
          {houses.map((house) => (
            <option value={house.slug} key={house.id}>
              {house.name}
            </option>
          ))}
        </select>
      </QuickField>

      <QuickField label="Check-in" icon={CalendarDays}>
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(event) => updateCheckIn(event.target.value)}
          className="w-full bg-transparent text-base font-semibold outline-none md:text-sm"
          aria-label="Data de check-in"
        />
      </QuickField>

      <QuickField label="Check-out" icon={CalendarDays}>
        <input
          type="date"
          min={minCheckOut}
          max={maxCheckOut}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          className="w-full bg-transparent text-base font-semibold outline-none md:text-sm"
          aria-label="Data de check-out"
        />
      </QuickField>

      <QuickField label="Hóspedes" icon={Users}>
        <input
          type="number"
          min={1}
          max={selectedHouse?.guests ?? undefined}
          step={1}
          inputMode="numeric"
          value={guests}
          onChange={(event) => setGuests(parseNumericInputValue(event.currentTarget.value))}
          onBlur={() => setGuests((current) => normalizeGuestCount(current, 1))}
          onFocus={(event) => event.currentTarget.select()}
          className="w-full bg-transparent text-base font-semibold outline-none md:text-sm"
          aria-label="Quantidade de hóspedes"
          aria-invalid={Boolean(guestError)}
          aria-describedby={guestError ? "quick-guests-error" : undefined}
        />
      </QuickField>

      <button
        type="submit"
        disabled={guests === "" || Boolean(guestError)}
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-[var(--color-copper)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <Search aria-hidden="true" size={17} />
        Consultar disponibilidade
      </button>

      {guestError ? (
        <p
          className="px-2 py-1 text-xs font-semibold text-red-700 md:col-span-full"
          id="quick-guests-error"
          aria-live="polite"
        >
          {guestError}
        </p>
      ) : null}
    </form>
  );
}

function getGuestError(guests: NumericInputValue, house?: BookingHouseOption) {
  if (guests === "") return undefined;
  if (!Number.isInteger(guests) || guests < 1) {
    return "Informe pelo menos 1 hóspede.";
  }
  if (house?.guests && guests > house.guests) {
    return `A ${house.name} recebe até ${house.guests} hóspedes.`;
  }
  return undefined;
}

function QuickField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-14 items-center gap-3 border border-[var(--color-line)] bg-white px-3">
      <Icon
        aria-hidden="true"
        className="shrink-0 text-[var(--color-ocean-strong)]"
        size={17}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {label}
        </span>
        <span className="mt-0.5 block">{children}</span>
      </span>
    </label>
  );
}
