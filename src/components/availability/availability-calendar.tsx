"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import { AvailabilityLegend } from "@/components/availability/availability-legend";
import {
  addDays,
  calculateNights,
  compareISODate,
  formatDateForDisplay,
  getMonthFromISO,
  getMonthLabel,
  getMonthMatrix,
  getTodayISO,
} from "@/lib/availability/date-utils";
import {
  isDateUnavailableFromRanges,
  isRangeAvailableFromRanges,
  isUnavailableDateSelectableAsCheckoutFromRanges,
} from "@/lib/availability/merge";
import { cn } from "@/lib/format";
import type { AvailabilityRange } from "@/lib/availability/types";

type AvailabilityCalendarProps = {
  unavailableRanges: AvailabilityRange[];
  checkIn: string;
  checkOut: string;
  onChange: (range: { checkIn: string; checkOut: string }) => void;
  error?: string;
  minDate?: string;
  minNights?: number | null;
  maxNights?: number | null;
  monthsToShow?: 1 | 2;
  onInvalidStay?: (nights: number) => void;
  onUnavailableRange?: () => void;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function addMonths(year: number, monthIndex: number, amount: number) {
  const date = new Date(Date.UTC(year, monthIndex + amount, 1));
  return { year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() };
}

function isBetween(date: string, startDate: string, endDate: string) {
  return compareISODate(date, startDate) > 0 && compareISODate(date, endDate) < 0;
}

export function AvailabilityCalendar({
  unavailableRanges,
  checkIn,
  checkOut,
  onChange,
  error,
  minDate = getTodayISO(),
  minNights,
  maxNights,
  monthsToShow = 1,
  onInvalidStay,
  onUnavailableRange,
}: AvailabilityCalendarProps) {
  const initialMonth = useMemo(
    () => getMonthFromISO(checkIn || minDate),
    [checkIn, minDate],
  );
  const [visibleMonth, setVisibleMonth] = useState(initialMonth);

  function moveMonth(amount: number) {
    setVisibleMonth((current) => addMonths(current.year, current.monthIndex, amount));
  }

  function focusDate(date: string) {
    requestAnimationFrame(() => {
      const button = document.querySelector<HTMLButtonElement>(`[data-date="${date}"]`);
      button?.focus();
    });
  }

  function onDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    const offset = offsets[event.key];
    if (!offset) return;

    event.preventDefault();
    const nextDate = addDays(date, offset);
    const nextMonth = getMonthFromISO(nextDate);
    const visibleEndMonth = addMonths(
      visibleMonth.year,
      visibleMonth.monthIndex,
      monthsToShow - 1,
    );
    const isOutsideVisibleMonths =
      compareISODate(
        nextDate,
        `${visibleMonth.year}-${String(visibleMonth.monthIndex + 1).padStart(2, "0")}-01`,
      ) < 0 ||
      nextMonth.year > visibleEndMonth.year ||
      (nextMonth.year === visibleEndMonth.year &&
        nextMonth.monthIndex > visibleEndMonth.monthIndex);

    if (isOutsideVisibleMonths) setVisibleMonth(nextMonth);
    focusDate(nextDate);
  }

  function selectDate(date: string) {
    const unavailable = isDateUnavailableFromRanges(date, unavailableRanges);
    if (compareISODate(date, minDate) < 0) return;

    const selectingCheckIn = !checkIn || checkOut || compareISODate(date, checkIn) <= 0;
    if (selectingCheckIn) {
      if (unavailable) return;
      onChange({ checkIn: date, checkOut: "" });
      return;
    }

    const candidateNights = calculateNights(checkIn, date);
    const tooShort = Boolean(minNights && candidateNights < minNights);
    const tooLong = Boolean(maxNights && candidateNights > maxNights);

    if (tooShort || tooLong) {
      onInvalidStay?.(candidateNights);
      return;
    }

    if (isRangeAvailableFromRanges(checkIn, date, unavailableRanges)) {
      onChange({ checkIn, checkOut: date });
      return;
    }

    onChange({ checkIn: date, checkOut: "" });
    onUnavailableRange?.();
  }

  const months = Array.from({ length: monthsToShow }, (_, index) =>
    addMonths(visibleMonth.year, visibleMonth.monthIndex, index),
  );
  const hasUnavailableRanges = unavailableRanges.length > 0;

  return (
    <div className="border border-[var(--color-line)] bg-white/70 p-2.5 sm:p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-copper)]">
            Calendário
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {hasUnavailableRanges
              ? "Selecione entrada e saída sem atravessar datas indisponíveis. O início da próxima reserva pode ser usado como checkout."
              : "Selecione entrada e saída para consultar a estadia."}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="grid size-10 place-items-center border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
            aria-label="Mês anterior"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="grid size-10 place-items-center border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-copper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
            aria-label="Próximo mês"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <div className={cn("mt-3 grid gap-3", monthsToShow === 2 && "md:grid-cols-2")}>
        {months.map((month, index) => (
          <MonthView
            key={`${month.year}-${month.monthIndex}`}
            month={month}
            hiddenOnMobile={monthsToShow === 2 && index === 1}
            unavailableRanges={unavailableRanges}
            checkIn={checkIn}
            checkOut={checkOut}
            minDate={minDate}
            onSelect={selectDate}
            onDayKeyDown={onDayKeyDown}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--color-line)] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <AvailabilityLegend showUnavailable={hasUnavailableRanges} />
        <p className="text-xs font-medium text-[var(--color-muted)]">
          {checkIn
            ? `Entrada: ${formatDateForDisplay(checkIn)}`
            : "Entrada não selecionada"}
          {" · "}
          {checkOut ? `Saída: ${formatDateForDisplay(checkOut)}` : "Saída não selecionada"}
        </p>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-700" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function MonthView({
  month,
  hiddenOnMobile,
  unavailableRanges,
  checkIn,
  checkOut,
  minDate,
  onSelect,
  onDayKeyDown,
}: {
  month: { year: number; monthIndex: number };
  hiddenOnMobile: boolean;
  unavailableRanges: AvailabilityRange[];
  checkIn: string;
  checkOut: string;
  minDate: string;
  onSelect: (date: string) => void;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: string) => void;
}) {
  const days = getMonthMatrix(month.year, month.monthIndex);

  return (
    <div className={hiddenOnMobile ? "hidden md:block" : undefined}>
      <h3 className="font-serif text-xl capitalize text-[var(--color-ink)]">
        {getMonthLabel(month.year, month.monthIndex)}
      </h3>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <span
            key={day}
            className="py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]"
          >
            {day}
          </span>
        ))}
        {days.map((date, index) =>
          date ? (
            <DayButton
              key={date}
              date={date}
              unavailableRanges={unavailableRanges}
              checkIn={checkIn}
              checkOut={checkOut}
              minDate={minDate}
              onSelect={onSelect}
              onDayKeyDown={onDayKeyDown}
            />
          ) : (
            <span key={`empty-${index}`} className="aspect-square" aria-hidden="true" />
          ),
        )}
      </div>
    </div>
  );
}

function DayButton({
  date,
  unavailableRanges,
  checkIn,
  checkOut,
  minDate,
  onSelect,
  onDayKeyDown,
}: {
  date: string;
  unavailableRanges: AvailabilityRange[];
  checkIn: string;
  checkOut: string;
  minDate: string;
  onSelect: (date: string) => void;
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: string) => void;
}) {
  const unavailable = isDateUnavailableFromRanges(date, unavailableRanges);
  const checkoutBoundary = Boolean(
    checkIn &&
      !checkOut &&
      compareISODate(date, checkIn) > 0 &&
      isUnavailableDateSelectableAsCheckoutFromRanges(checkIn, date, unavailableRanges),
  );
  const past = compareISODate(date, minDate) < 0;
  const selectedStart = date === checkIn;
  const selectedEnd = date === checkOut;
  const inRange = Boolean(checkIn && checkOut && isBetween(date, checkIn, checkOut));
  const disabled = past || (unavailable && !checkoutBoundary);
  const label = `${formatDateForDisplay(date)} ${
    checkoutBoundary
      ? "disponível apenas para checkout"
      : unavailable
        ? "indisponível"
        : "disponível"
  }`;

  if (past) {
    return <span className="aspect-square min-h-8 sm:min-h-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      data-date={date}
      disabled={disabled}
      onClick={() => onSelect(date)}
      onKeyDown={(event) => onDayKeyDown(event, date)}
      aria-pressed={selectedStart || selectedEnd}
      aria-label={label}
      className={cn(
        "aspect-square min-h-8 border text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] sm:min-h-9 sm:text-sm",
        disabled &&
          "cursor-not-allowed border-[var(--color-line)] bg-[var(--color-soft)] text-[var(--color-muted)] opacity-55",
        unavailable && !checkoutBoundary &&
          "line-through decoration-[var(--color-copper)] decoration-2",
        checkoutBoundary &&
          "border-[var(--color-copper)] bg-[var(--color-soft)] text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-copper)]/35 hover:bg-white",
        !disabled &&
          !checkoutBoundary &&
          !inRange &&
          !selectedStart &&
          !selectedEnd &&
          "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-copper)] hover:bg-[var(--color-soft)]",
        inRange && !disabled && "border-[var(--color-ocean)] bg-[var(--color-ocean)]/10",
        (selectedStart || selectedEnd) &&
          "border-[var(--color-ocean-strong)] bg-[var(--color-ocean-strong)] text-white hover:bg-[var(--color-ocean-strong)]",
      )}
    >
      {Number(date.slice(-2))}
    </button>
  );
}
