"use client";

import { CalendarDays, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AvailabilityCalendar } from "@/components/availability/availability-calendar";
import { formatDateForDisplay } from "@/lib/availability/date-utils";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/format";
import type { AvailabilityRange } from "@/lib/availability/types";

type DateRangeSelectorProps = {
  unavailableRanges: AvailabilityRange[];
  checkIn: string;
  checkOut: string;
  minNights?: number | null;
  maxNights?: number | null;
  stayRuleLabel?: string;
  onChange: (range: { checkIn: string; checkOut: string }) => void;
  onInvalidStay?: (nights: number) => void;
  error?: string;
};

export function DateRangeSelector({
  unavailableRanges,
  checkIn,
  checkOut,
  minNights,
  maxNights,
  stayRuleLabel,
  onChange,
  onInvalidStay,
  error,
}: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const errorId = useId();

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function updateRange(range: { checkIn: string; checkOut: string }) {
    onChange(range);
    if (range.checkIn && range.checkOut) {
      window.setTimeout(() => setOpen(false), 160);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[var(--color-ink)]">Datas</span>
        <button
          type="button"
          onClick={() => {
            setOpen((current) => {
              if (!current) trackEvent("open_calendar");
              return !current;
            });
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-copper)] transition hover:text-[var(--color-ocean-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
          aria-expanded={open}
          aria-controls={panelId}
        >
          <CalendarDays aria-hidden="true" size={15} />
          {open ? "Fechar calendário" : "Escolher datas"}
        </button>
      </div>

      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
        <DateFieldButton
          label="Entrada"
          value={checkIn}
          open={open}
          onOpen={() => setOpen(true)}
          panelId={panelId}
          errorId={error ? errorId : undefined}
        />
        <DateFieldButton
          label="Saída"
          value={checkOut}
          open={open}
          onOpen={() => setOpen(true)}
          panelId={panelId}
          errorId={error ? errorId : undefined}
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-700" id={errorId} aria-live="polite">
          {error}
        </p>
      ) : null}
      {stayRuleLabel && !error ? (
        <p className="mt-2 text-sm text-[var(--color-muted)]">{stayRuleLabel}</p>
      ) : null}

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-3 top-16 z-[70] max-h-[calc(100svh-5rem)] overflow-y-auto border border-[var(--color-line)] bg-[var(--color-shell)] p-3 shadow-[0_24px_70px_rgba(23,35,34,0.24)] sm:absolute sm:inset-auto sm:left-0 sm:top-[calc(100%+0.5rem)] sm:z-40 sm:w-[min(820px,calc(100vw-2rem))] sm:overflow-visible"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Escolha o período
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
              aria-label="Fechar calendário"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
          <AvailabilityCalendar
            unavailableRanges={unavailableRanges}
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={updateRange}
            minNights={minNights}
            maxNights={maxNights}
            onInvalidStay={onInvalidStay}
            monthsToShow={2}
          />
        </div>
      ) : null}
    </div>
  );
}

function DateFieldButton({
  label,
  value,
  open,
  onOpen,
  panelId,
  errorId,
}: {
  label: "Entrada" | "Saída";
  value: string;
  open: boolean;
  onOpen: () => void;
  panelId: string;
  errorId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex min-h-14 items-center justify-between gap-3 border bg-[var(--color-shell)] px-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]",
        open
          ? "border-[var(--color-copper)] ring-2 ring-[var(--color-copper)]/15"
          : "border-[var(--color-line)] hover:border-[var(--color-copper)]",
      )}
      aria-label={`Selecionar data de ${label.toLowerCase()}`}
      aria-expanded={open}
      aria-controls={panelId}
      aria-describedby={errorId}
    >
      <span>
        <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {label}
        </span>
        <span className="mt-0.5 block text-sm font-semibold text-[var(--color-ink)]">
          {value ? formatDateForDisplay(value) : "Escolher data"}
        </span>
      </span>
      <CalendarDays
        aria-hidden="true"
        className="shrink-0 text-[var(--color-copper)]"
        size={17}
      />
    </button>
  );
}
