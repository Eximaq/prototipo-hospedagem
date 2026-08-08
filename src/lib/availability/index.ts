import generatedAvailability from "@/generated/availability.json";
import { houses } from "@/data/houses";
import { localReservations } from "@/data/reservations";
import {
  isDateAvailableFromRanges,
  isDateUnavailableFromRanges,
  isRangeAvailableFromRanges,
  mergeAvailabilitySources,
} from "@/lib/availability/merge";
import type {
  AvailabilityRange,
  PublicHouseAvailability,
  Reservation,
} from "@/lib/availability/types";

type GeneratedAvailability = {
  generatedAt: string | null;
  reservations: Reservation[];
};

const generated = generatedAvailability as GeneratedAvailability;

export function getAllReservations() {
  return [...localReservations, ...generated.reservations];
}

export function getUnavailableRanges(houseId: string) {
  return mergeAvailabilitySources(getAllReservations(), { houseId });
}

export function getHouseAvailability(houseId: string): PublicHouseAvailability {
  return {
    houseId,
    unavailableRanges: getUnavailableRanges(houseId),
  };
}

export function getPublicAvailability() {
  return houses.map((house) => getHouseAvailability(house.id));
}

export function getUnavailableRangesFromPublicAvailability(
  availability: PublicHouseAvailability[],
  houseId: string,
) {
  return (
    availability.find((entry) => entry.houseId === houseId)?.unavailableRanges || []
  );
}

export function isDateUnavailable(houseId: string, date: string) {
  return isDateUnavailableFromRanges(date, getUnavailableRanges(houseId));
}

export function isDateAvailable(houseId: string, date: string) {
  return isDateAvailableFromRanges(date, getUnavailableRanges(houseId));
}

export function isRangeAvailable(
  houseId: string,
  checkIn: string,
  checkOut: string,
) {
  return isRangeAvailableFromRanges(checkIn, checkOut, getUnavailableRanges(houseId));
}

export function summarizeRangesForMessage(ranges: AvailabilityRange[]) {
  return ranges.map((range) => `${range.startDate} a ${range.endDate}`).join(", ");
}

export type {
  AvailabilityProvider,
  AvailabilityRange,
  ExternalCalendar,
  ExternalCalendarProvider,
  PublicHouseAvailability,
  Reservation,
  ReservationSource,
  ReservationStatus,
} from "@/lib/availability/types";

export {
  BLOCKING_STATUSES,
  dedupeReservations,
  isDateAvailableFromRanges,
  isDateUnavailableFromRanges,
  isRangeAvailableFromRanges,
  mergeAvailabilitySources,
  reservationBlocksAvailability,
} from "@/lib/availability/merge";

export {
  addDays,
  compareISODate,
  formatDateForDisplay,
  getMonthFromISO,
  getMonthLabel,
  getMonthMatrix,
  getTodayISO,
  isISODate,
  isValidDateRange,
} from "@/lib/availability/date-utils";

export {
  normalizeReservation,
  normalizeReservations,
} from "@/lib/availability/normalize";

export {
  ICalAvailabilityProvider,
  parseICalendar,
} from "@/lib/availability/providers/ical-provider";
export { AirbnbAvailabilityProvider } from "@/lib/availability/providers/airbnb-provider";
export { BookingAvailabilityProvider } from "@/lib/availability/providers/booking-provider";
export { VrboAvailabilityProvider } from "@/lib/availability/providers/vrbo-provider";
export { GoogleCalendarAvailabilityProvider } from "@/lib/availability/providers/google-calendar-provider";
export { LocalAvailabilityProvider } from "@/lib/availability/providers/local-provider";
