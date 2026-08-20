import { describe, expect, it } from "vitest";
import {
  CalendarSourceError,
  RemoteICSCalendarSource,
} from "@/lib/availability/providers/calendar-source";

const privateTestUrl = "https://calendar.example.test/export.ics?token=do-not-log";

function validCalendar(uid = "event@example.test") {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calendar Test//PT-BR",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    "DTSTAMP:20260101T000000Z",
    "DTSTART;VALUE=DATE:20260910",
    "DTEND;VALUE=DATE:20260915",
    "SUMMARY:Private test event",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function source(fetchImpl: typeof fetch, timeoutMs = 100) {
  return new RemoteICSCalendarSource(privateTestUrl, {
    houseId: "casa-01",
    label: "Casa Turquesa",
    fetchImpl,
    timeoutMs,
  });
}

describe("RemoteICSCalendarSource", () => {
  it("downloads and parses a valid ICS response", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(validCalendar(), {
        status: 200,
        headers: { "content-type": "text/calendar; charset=utf-8" },
      });

    const result = await source(fetchImpl).getEvents();

    expect(result.eventsFound).toBe(1);
    expect(result.events[0]).toMatchObject({
      startDate: "2026-09-10",
      endDate: "2026-09-15",
    });
  });

  it("rejects HTTP errors without including the private URL", async () => {
    const fetchImpl: typeof fetch = async () => new Response("not found", { status: 404 });

    const error = await source(fetchImpl)
      .getEvents()
      .catch((reason) => reason);

    expect(error).toBeInstanceOf(CalendarSourceError);
    expect(error.code).toBe("http");
    expect(String(error)).not.toContain(privateTestUrl);
    expect(String(error)).not.toContain("do-not-log");
  });

  it("aborts requests after the configured timeout", async () => {
    const fetchImpl: typeof fetch = async (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      });

    const error = await source(fetchImpl, 5)
      .getEvents()
      .catch((reason) => reason);

    expect(error).toBeInstanceOf(CalendarSourceError);
    expect(error.code).toBe("timeout");
  });

  it("rejects empty and malformed calendar bodies", async () => {
    const emptyFetch: typeof fetch = async () =>
      new Response("", {
        status: 200,
        headers: { "content-type": "text/calendar" },
      });
    const invalidFetch: typeof fetch = async () =>
      new Response("this is not an iCalendar file", {
        status: 200,
        headers: { "content-type": "text/calendar" },
      });

    const emptyError = await source(emptyFetch)
      .getEvents()
      .catch((reason) => reason);
    const invalidError = await source(invalidFetch)
      .getEvents()
      .catch((reason) => reason);

    expect(emptyError.code).toBe("empty");
    expect(invalidError.code).toBe("invalid-ics");
  });

  it("rejects HTML responses and calendars without events", async () => {
    const htmlFetch: typeof fetch = async () =>
      new Response("<html>login</html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    const noEventsFetch: typeof fetch = async () =>
      new Response("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR", {
        status: 200,
        headers: { "content-type": "text/calendar" },
      });

    const htmlError = await source(htmlFetch)
      .getEvents()
      .catch((reason) => reason);
    const noEventsError = await source(noEventsFetch)
      .getEvents()
      .catch((reason) => reason);

    expect(htmlError.code).toBe("content-type");
    expect(noEventsError.code).toBe("invalid-ics");
  });
});
