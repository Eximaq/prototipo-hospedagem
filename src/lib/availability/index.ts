import generatedAvailability from "@/generated/availability.json";
import { houses } from "@/data/houses";
import { localReservations } from "@/data/reservations";
import {
  isDateAvailableFromRanges,
  isDateUnavailableFromRanges,
  isRangeAvailableFromRanges,
  mergeAvailabilitySources,
  mergeUnavailableRanges,
} from "@/lib/availability/merge";
import type {
  AvailabilityRange,
  GeneratedAvailabilitySnapshot,
  PublicHouseAvailability,
} from "@/lib/availability/types";

const generated = generatedAvailability as GeneratedAvailabilitySnapshot;

export function getAllReservations() {
  return [...localReservations];
}

export function getUnavailableRanges(houseId: string) {
  const generatedRanges = generated.houses[houseId]?.unavailableRanges.map((range) => ({
    startDate: range.start,
    endDate: range.end,
  })) || [];
  const localRanges = mergeAvailabilitySources(getAllReservations(), { houseId });

  return mergeUnavailableRanges([...generatedRanges, ...localRanges]);
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
  mergeUnavailableRanges,
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
