import {
  compareISODate,
  isDateInRange,
  isValidDateRange,
  rangesOverlap,
  toDayNumber,
} from "@/lib/availability/date-utils";
import { normalizeReservations } from "@/lib/availability/normalize";
import type {
  AvailabilityMergeOptions,
  AvailabilityRange,
  Reservation,
  ReservationStatus,
} from "@/lib/availability/types";

export const BLOCKING_STATUSES: ReservationStatus[] = ["confirmed", "blocked"];

function getBlockingStatuses(options?: AvailabilityMergeOptions) {
  return options?.pendingBlocks
    ? [...BLOCKING_STATUSES, "pending"]
    : BLOCKING_STATUSES;
}

export function reservationBlocksAvailability(
  reservation: Reservation,
  options?: AvailabilityMergeOptions,
) {
  return getBlockingStatuses(options).includes(reservation.status);
}

function getDeduplicationKey(reservation: Reservation) {
  if (reservation.externalId) {
    return [
      reservation.houseId,
      reservation.source,
      reservation.externalId,
      reservation.startDate,
      reservation.endDate,
    ].join("|");
  }

  return [
    reservation.houseId,
    reservation.source,
    reservation.id,
    reservation.startDate,
    reservation.endDate,
  ].join("|");
}

export function dedupeReservations(reservations: Reservation[]) {
  const seen = new Set<string>();
  const unique: Reservation[] = [];

  for (const reservation of reservations) {
    const key = getDeduplicationKey(reservation);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(reservation);
  }

  return unique;
}

export function mergeAvailabilitySources(
  reservations: Reservation[],
  options?: AvailabilityMergeOptions,
) {
  const ranges = dedupeReservations(normalizeReservations(reservations))
    .filter((reservation) => !options?.houseId || reservation.houseId === options.houseId)
    .filter((reservation) => reservationBlocksAvailability(reservation, options))
    .map<AvailabilityRange>((reservation) => ({
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    }))
  return mergeUnavailableRanges(ranges);
}

export function mergeUnavailableRanges(ranges: AvailabilityRange[]) {
  const sortedRanges = ranges
    .filter((range) => isValidDateRange(range.startDate, range.endDate))
    .map((range) => ({ ...range }))
    .sort((a, b) => {
      const startOrder = compareISODate(a.startDate, b.startDate);
      if (startOrder !== 0) return startOrder;
      return compareISODate(a.endDate, b.endDate);
    });

  const merged: AvailabilityRange[] = [];

  for (const range of sortedRanges) {
    const current = merged.at(-1);
    if (!current) {
      merged.push({ ...range });
      continue;
    }

    const overlapsOrTouches = toDayNumber(range.startDate) <= toDayNumber(current.endDate);
    if (overlapsOrTouches) {
      if (compareISODate(range.endDate, current.endDate) > 0) {
        current.endDate = range.endDate;
      }
      continue;
    }

    merged.push({ ...range });
  }

  return merged;
}

export function isDateUnavailableFromRanges(
  date: string,
  unavailableRanges: AvailabilityRange[],
) {
  return unavailableRanges.some((range) => isDateInRange(date, range));
}

export function isDateAvailableFromRanges(
  date: string,
  unavailableRanges: AvailabilityRange[],
) {
  return !isDateUnavailableFromRanges(date, unavailableRanges);
}

export function isRangeAvailableFromRanges(
  checkIn: string,
  checkOut: string,
  unavailableRanges: AvailabilityRange[],
) {
  if (!isValidDateRange(checkIn, checkOut)) return false;

  return unavailableRanges.every(
    (range) => !rangesOverlap({ startDate: checkIn, endDate: checkOut }, range),
  );
}
