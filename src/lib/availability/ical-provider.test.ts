import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { mergeAvailabilitySources } from "@/lib/availability/merge";
import { parseICalendar } from "@/lib/availability/providers/ical-provider";

function fixture(name: string) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  return readFileSync(path.join(dirname, "__fixtures__", name), "utf8");
}

describe("parseICalendar", () => {
  it("parses multiple VEVENT blocks with DTSTART, DTEND and UID", () => {
    const reservations = parseICalendar(
      fixture("airbnb-basic.ics"),
      "casa-01",
      "airbnb",
      "Airbnb test",
    );

    expect(reservations).toHaveLength(2);
    expect(reservations[0]).toMatchObject({
      houseId: "casa-01",
      startDate: "2026-09-10",
      endDate: "2026-09-15",
      source: "airbnb",
      status: "confirmed",
      externalId: "airbnb-001@example.test",
    });
  });

  it("ignores cancelled events and normalizes timezone/no-timezone values by calendar day", () => {
    const reservations = parseICalendar(
      fixture("mixed-status-timezone.ics"),
      "casa-02",
      "ical",
    );

    expect(reservations).toHaveLength(2);
    expect(reservations.map((reservation) => reservation.startDate)).toEqual([
      "2026-10-05",
      "2026-10-12",
    ]);
    expect(reservations.map((reservation) => reservation.endDate)).toEqual([
      "2026-10-08",
      "2026-10-14",
    ]);
  });

  it("normalizes overlapping imported events into one public unavailable range", () => {
    const content = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:a@example.test
DTSTART;VALUE=DATE:20261110
DTEND;VALUE=DATE:20261115
END:VEVENT
BEGIN:VEVENT
UID:b@example.test
DTSTART;VALUE=DATE:20261114
DTEND;VALUE=DATE:20261120
END:VEVENT
END:VCALENDAR`;
    const reservations = parseICalendar(content, "casa-01", "vrbo");

    expect(mergeAvailabilitySources(reservations)).toEqual([
      { startDate: "2026-11-10", endDate: "2026-11-20" },
    ]);
  });
});
