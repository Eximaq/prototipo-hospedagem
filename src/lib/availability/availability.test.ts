import { describe, expect, it } from "vitest";
import { calculateNights } from "@/lib/availability/date-utils";
import {
  isDateAvailableFromRanges,
  isDateUnavailableFromRanges,
  isRangeAvailableFromRanges,
  mergeUnavailableRanges,
  mergeAvailabilitySources,
} from "@/lib/availability/merge";
import type { Reservation } from "@/lib/availability/types";

function reservation(overrides: Partial<Reservation>): Reservation {
  return {
    id: "reservation",
    houseId: "casa-01",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    source: "manual",
    status: "confirmed",
    ...overrides,
  };
}

describe("availability merge", () => {
  it("marks dates inside [startDate, endDate) as unavailable", () => {
    const ranges = mergeAvailabilitySources([reservation({})], { houseId: "casa-01" });

    expect(isDateUnavailableFromRanges("2026-09-10", ranges)).toBe(true);
    expect(isDateUnavailableFromRanges("2026-09-14", ranges)).toBe(true);
    expect(isDateAvailableFromRanges("2026-09-15", ranges)).toBe(true);
  });

  it("keeps availability independent by houseId", () => {
    const ranges = mergeAvailabilitySources(
      [
        reservation({ houseId: "casa-01" }),
        reservation({
          id: "reservation-2",
          houseId: "casa-02",
          startDate: "2026-09-20",
          endDate: "2026-09-24",
        }),
      ],
      { houseId: "casa-02" },
    );

    expect(isDateUnavailableFromRanges("2026-09-12", ranges)).toBe(false);
    expect(isDateUnavailableFromRanges("2026-09-21", ranges)).toBe(true);
  });

  it("merges overlapping ranges", () => {
    const ranges = mergeAvailabilitySources([
      reservation({ id: "a", startDate: "2026-09-10", endDate: "2026-09-15" }),
      reservation({ id: "b", startDate: "2026-09-14", endDate: "2026-09-20" }),
    ]);

    expect(ranges).toEqual([{ startDate: "2026-09-10", endDate: "2026-09-20" }]);
  });

  it("merges adjacent ranges to avoid visual duplication", () => {
    const ranges = mergeAvailabilitySources([
      reservation({ id: "a", startDate: "2026-09-10", endDate: "2026-09-12" }),
      reservation({ id: "b", startDate: "2026-09-12", endDate: "2026-09-14" }),
    ]);

    expect(ranges).toEqual([{ startDate: "2026-09-10", endDate: "2026-09-14" }]);
  });

  it("merges normalized ranges directly and ignores empty or invalid periods", () => {
    expect(
      mergeUnavailableRanges([
        { startDate: "2026-09-10", endDate: "2026-09-15" },
        { startDate: "2026-09-14", endDate: "2026-09-20" },
        { startDate: "2026-09-20", endDate: "2026-09-22" },
        { startDate: "2026-10-01", endDate: "2026-10-01" },
      ]),
    ).toEqual([{ startDate: "2026-09-10", endDate: "2026-09-22" }]);
  });

  it("does not block cancelled reservations", () => {
    const ranges = mergeAvailabilitySources([
      reservation({ id: "cancelled", status: "cancelled" }),
    ]);

    expect(ranges).toEqual([]);
  });

  it("keeps pending reservations configurable", () => {
    const pending = reservation({ id: "pending", status: "pending" });

    expect(mergeAvailabilitySources([pending])).toEqual([]);
    expect(mergeAvailabilitySources([pending], { pendingBlocks: true })).toEqual([
      { startDate: "2026-09-10", endDate: "2026-09-15" },
    ]);
  });

  it("deduplicates the same external reservation without deleting distinct same-date events", () => {
    const ranges = mergeAvailabilitySources([
      reservation({
        id: "airbnb-a",
        source: "airbnb",
        externalId: "same-uid",
      }),
      reservation({
        id: "airbnb-a-copy",
        source: "airbnb",
        externalId: "same-uid",
      }),
      reservation({
        id: "booking-same-dates",
        source: "booking",
        externalId: "different-uid",
      }),
    ]);

    expect(ranges).toEqual([{ startDate: "2026-09-10", endDate: "2026-09-15" }]);
  });

  it("rejects ranges that cross an unavailable period", () => {
    const ranges = mergeAvailabilitySources([
      reservation({ startDate: "2026-09-15", endDate: "2026-09-20" }),
    ]);

    expect(isRangeAvailableFromRanges("2026-09-10", "2026-09-25", ranges)).toBe(false);
    expect(isRangeAvailableFromRanges("2026-09-10", "2026-09-15", ranges)).toBe(true);
    expect(isRangeAvailableFromRanges("2026-09-20", "2026-09-25", ranges)).toBe(true);
  });

  it("rejects an occupied check-in and an invalid check-out", () => {
    const ranges = [{ startDate: "2026-09-15", endDate: "2026-09-20" }];

    expect(isRangeAvailableFromRanges("2026-09-15", "2026-09-22", ranges)).toBe(false);
    expect(isRangeAvailableFromRanges("2026-09-22", "2026-09-22", ranges)).toBe(false);
    expect(isRangeAvailableFromRanges("2026-09-22", "2026-09-21", ranges)).toBe(false);
  });

  it("calculates nights across month and year boundaries", () => {
    expect(calculateNights("2026-09-29", "2026-10-03")).toBe(4);
    expect(calculateNights("2026-12-30", "2027-01-03")).toBe(4);
    expect(calculateNights("2026-09-10", "2026-09-10")).toBe(0);
  });
});
