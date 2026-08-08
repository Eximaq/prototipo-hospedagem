import { describe, expect, it } from "vitest";
import { birthDateInputToISO, formatBirthDateInput } from "@/lib/birth-date";

describe("birth date input", () => {
  it("formats digits as a Brazilian date", () => {
    expect(formatBirthDateInput("15051990")).toBe("15/05/1990");
    expect(formatBirthDateInput("15/05/1990")).toBe("15/05/1990");
    expect(formatBirthDateInput("1505")).toBe("15/05");
  });

  it("converts valid Brazilian dates to ISO", () => {
    expect(birthDateInputToISO("15/05/1990")).toBe("1990-05-15");
    expect(birthDateInputToISO("1990-05-15")).toBe("1990-05-15");
  });

  it("rejects invalid calendar dates", () => {
    expect(birthDateInputToISO("31/02/1990")).toBeNull();
    expect(birthDateInputToISO("15/13/1990")).toBeNull();
    expect(birthDateInputToISO("15051990")).toBeNull();
  });
});
