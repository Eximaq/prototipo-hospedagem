import { describe, expect, it } from "vitest";
import {
  getGuestTotal,
  normalizeGuestCount,
  parseNumericInputValue,
} from "@/lib/guest-count";

describe("guest count input", () => {
  it("keeps an empty intermediate value while the user is editing", () => {
    expect(parseNumericInputValue("")).toBe("");
    expect(parseNumericInputValue("5")).toBe(5);
  });

  it("normalizes invalid adult values to one on commit", () => {
    expect(normalizeGuestCount("", 1)).toBe(1);
    expect(normalizeGuestCount(-1, 1)).toBe(1);
    expect(normalizeGuestCount(3.8, 1)).toBe(3);
  });

  it("normalizes invalid child values to zero on commit", () => {
    expect(normalizeGuestCount("", 0)).toBe(0);
    expect(normalizeGuestCount(-1, 0)).toBe(0);
    expect(normalizeGuestCount(3, 0)).toBe(3);
  });

  it("only calculates the total when both fields are complete", () => {
    expect(getGuestTotal(5, 2)).toBe(7);
    expect(getGuestTotal("", 2)).toBeNull();
    expect(getGuestTotal(5, "")).toBeNull();
  });
});
