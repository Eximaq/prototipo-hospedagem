"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, Home, Search, Users, type LucideIcon } from "lucide-react";
import type { BookingHouseOption } from "@/components/booking/availability-form";
import { getTodayISO } from "@/lib/availability/date-utils";
import { trackEvent } from "@/lib/analytics";

type QuickAvailabilityBarProps = {
  houses: BookingHouseOption[];
};

export function QuickAvailabilityBar({ houses }: QuickAvailabilityBarProps) {
  const today = getTodayISO();
  const [houseSlug, setHouseSlug] = useState(houses[0]?.slug || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const detail = {
      houseSlug,
      checkIn,
      checkOut,
      adults: guests,
      children: 0,
    };

    trackEvent("start_booking", {
      houseSlug,
      hasCheckIn: Boolean(checkIn),
      hasCheckOut: Boolean(checkOut),
      guests,
    });

    window.dispatchEvent(new CustomEvent("booking-prefill", { detail }));

    const params = new URLSearchParams();
    if (houseSlug) params.set("casa", houseSlug);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", String(Math.max(1, guests)));

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
          onChange={(event) => setHouseSlug(event.target.value)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
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
          onChange={(event) => setCheckIn(event.target.value)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label="Data de check-in"
        />
      </QuickField>

      <QuickField label="Check-out" icon={CalendarDays}>
        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label="Data de check-out"
        />
      </QuickField>

      <QuickField label="Hóspedes" icon={Users}>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value) || 1)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          aria-label="Quantidade de hóspedes"
        />
      </QuickField>

      <button
        type="submit"
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-[var(--color-copper)] px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-ocean-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <Search aria-hidden="true" size={17} />
        Consultar disponibilidade
      </button>
    </form>
  );
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
      <Icon aria-hidden="true" className="shrink-0 text-[var(--color-ocean-strong)]" size={17} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {label}
        </span>
        <span className="mt-0.5 block">{children}</span>
      </span>
    </label>
  );
}
