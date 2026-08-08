import {
  compareISODate,
  isISODate,
  isValidDateRange,
} from "@/lib/availability/date-utils";
import type { Reservation } from "@/lib/availability/types";

export function normalizeReservation(reservation: Reservation) {
  const startDate = reservation.startDate.trim();
  const endDate = reservation.endDate.trim();

  if (!isISODate(startDate) || !isISODate(endDate)) return null;
  if (!isValidDateRange(startDate, endDate)) return null;

  return {
    ...reservation,
    startDate,
    endDate,
  };
}

export function normalizeReservations(reservations: Reservation[]) {
  return reservations
    .map(normalizeReservation)
    .filter((reservation): reservation is Reservation => Boolean(reservation))
    .sort((a, b) => {
      const houseOrder = a.houseId.localeCompare(b.houseId);
      if (houseOrder !== 0) return houseOrder;
      const startOrder = compareISODate(a.startDate, b.startDate);
      if (startOrder !== 0) return startOrder;
      return compareISODate(a.endDate, b.endDate);
    });
}
