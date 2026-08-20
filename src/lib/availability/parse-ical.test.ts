import { describe, expect, it } from "vitest";
import { parseICS } from "@/lib/availability/parse-ical";

function calendar(...events: string[]) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Casas Milagres Test//PT-BR",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

function event(lines: string[]) {
  return [
    "BEGIN:VEVENT",
    "DTSTAMP:20260101T000000Z",
    "SUMMARY:Conteúdo que não deve sair do parser",
    ...lines,
    "END:VEVENT",
  ].join("\r\n");
}

describe("parseICS", () => {
  it("parses a DATE event and ignores folded and unknown fields", () => {
    const result = parseICS(
      calendar(
        event([
          "UID:event-1@example.test",
          "DTSTART;VALUE=DATE:20260910",
          "DTEND;VALUE=DATE:20260915",
          "DESCRIPTION:linha privada que continua",
          " dobrada e não deve ser publicada",
          "X-UNKNOWN:test",
        ]),
      ),
    );

    expect(result.eventsFound).toBe(1);
    expect(result.events).toEqual([
      {
        uid: "event-1@example.test",
        startDate: "2026-09-10",
        endDate: "2026-09-15",
        status: "confirmed",
      },
    ]);
  });

  it("parses multiple events and supplies an exclusive end for missing DTEND", () => {
    const result = parseICS(
      calendar(
        event([
          "UID:event-1@example.test",
          "DTSTART;VALUE=DATE:20261030",
          "DTEND;VALUE=DATE:20261102",
        ]),
        event(["UID:event-2@example.test", "DTSTART;VALUE=DATE:20261231"]),
      ),
    );

    expect(result.eventsFound).toBe(2);
    expect(result.events.map(({ startDate, endDate }) => ({ startDate, endDate }))).toEqual([
      { startDate: "2026-10-30", endDate: "2026-11-02" },
      { startDate: "2026-12-31", endDate: "2027-01-01" },
    ]);
  });

  it("does not return cancelled events", () => {
    const result = parseICS(
      calendar(
        event([
          "UID:cancelled@example.test",
          "STATUS:CANCELLED",
          "DTSTART;VALUE=DATE:20260910",
          "DTEND;VALUE=DATE:20260915",
        ]),
      ),
    );

    expect(result.eventsFound).toBe(1);
    expect(result.events).toEqual([]);
  });

  it("returns an empty result for an empty calendar", () => {
    expect(parseICS("")).toEqual({ eventsFound: 0, events: [] });
    expect(parseICS(calendar())).toEqual({ eventsFound: 0, events: [] });
  });

  it("normalizes explicit timezones to the property calendar day", () => {
    const result = parseICS(
      calendar(
        event([
          "UID:timezone@example.test",
          "DTSTART:20260910T013000Z",
          "DTEND:20260910T043000Z",
        ]),
      ),
    );

    expect(result.events[0]).toMatchObject({
      startDate: "2026-09-09",
      endDate: "2026-09-10",
    });
  });

  it("expands recurring events and honors EXDATE", () => {
    const result = parseICS(
      calendar(
        event([
          "UID:recurring@example.test",
          "DTSTART;VALUE=DATE:20260910",
          "DTEND;VALUE=DATE:20260912",
          "RRULE:FREQ=WEEKLY;COUNT=3",
          "EXDATE;VALUE=DATE:20260917",
        ]),
      ),
      {
        recurrenceWindowStart: "2026-09-01",
        recurrenceWindowEnd: "2026-10-01",
      },
    );

    expect(result.events.map(({ startDate, endDate }) => ({ startDate, endDate }))).toEqual([
      { startDate: "2026-09-10", endDate: "2026-09-12" },
      { startDate: "2026-09-24", endDate: "2026-09-26" },
    ]);
  });
});
