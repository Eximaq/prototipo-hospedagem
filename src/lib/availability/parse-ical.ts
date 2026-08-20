import * as ical from "node-ical";
import type { DateWithTimeZone, VEvent } from "node-ical";
import {
  addDays,
  compareISODate,
  getTodayISO,
  PROPERTY_TIME_ZONE,
} from "@/lib/availability/date-utils";
import type {
  CalendarEvent,
  CalendarParseResult,
} from "@/lib/availability/types";

const DEFAULT_RECURRENCE_PAST_YEARS = 5;
const DEFAULT_RECURRENCE_FUTURE_YEARS = 5;

export type ParseICSOptions = {
  recurrenceWindowStart?: string;
  recurrenceWindowEnd?: string;
};

function getYearOffset(value: string, offset: number) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year + offset, month - 1, day));
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function toWindowDate(value: string, endOfDay = false) {
  return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
}

function localDateParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function zonedDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: PROPERTY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function calendarDateToISO(date: DateWithTimeZone) {
  // DATE and floating DATE-TIME values represent local calendar fields. Values
  // with an explicit timezone represent an instant converted to the property zone.
  const parts = date.dateOnly || !date.tz ? localDateParts(date) : zonedDateParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function calendarEventBlocksAvailability(event: Pick<VEvent, "status">) {
  return event.status?.toUpperCase() !== "CANCELLED";
}

function normalizeStatus(event: Pick<VEvent, "status">): CalendarEvent["status"] {
  if (event.status?.toUpperCase() === "CANCELLED") return "cancelled";
  if (event.status?.toUpperCase() === "TENTATIVE") return "tentative";
  return "confirmed";
}

function toCalendarEvent(
  event: VEvent,
  start: DateWithTimeZone,
  end?: DateWithTimeZone,
): CalendarEvent | null {
  const startDate = calendarDateToISO(start);
  let endDate = end ? calendarDateToISO(end) : addDays(startDate, 1);

  // A timed event contained in one calendar day still blocks that day.
  if (compareISODate(endDate, startDate) <= 0) endDate = addDays(startDate, 1);

  return {
    uid: event.uid,
    startDate,
    endDate,
    status: normalizeStatus(event),
  };
}

function getEventInstances(event: VEvent, options: ParseICSOptions) {
  if (!event.rrule) {
    return [{ start: event.start, end: event.end, event }];
  }

  const today = getTodayISO();
  const from = options.recurrenceWindowStart ||
    getYearOffset(today, -DEFAULT_RECURRENCE_PAST_YEARS);
  const to = options.recurrenceWindowEnd ||
    getYearOffset(today, DEFAULT_RECURRENCE_FUTURE_YEARS);

  return ical.expandRecurringEvent(event, {
    from: toWindowDate(from),
    to: toWindowDate(to, true),
    includeOverrides: true,
    excludeExdates: true,
    expandOngoing: true,
  });
}

export function parseICS(
  content: string,
  options: ParseICSOptions = {},
): CalendarParseResult {
  if (!content.trim()) return { eventsFound: 0, events: [] };

  const components = ical.sync.parseICS(content);
  const sourceEvents = Object.values(components).filter(
    (component): component is VEvent => component?.type === "VEVENT",
  );
  if (!sourceEvents.length) return { eventsFound: 0, events: [] };

  const events: CalendarEvent[] = [];
  let cancelledEvents = 0;
  let invalidEvents = 0;

  for (const sourceEvent of sourceEvents) {
    if (!calendarEventBlocksAvailability(sourceEvent)) {
      cancelledEvents += 1;
      continue;
    }
    if (!sourceEvent.start) {
      invalidEvents += 1;
      continue;
    }

    try {
      for (const instance of getEventInstances(sourceEvent, options)) {
        if (!calendarEventBlocksAvailability(instance.event)) continue;
        const event = toCalendarEvent(instance.event, instance.start, instance.end);
        if (event) events.push(event);
      }
    } catch {
      invalidEvents += 1;
    }
  }

  return {
    eventsFound: sourceEvents.length,
    cancelledEvents,
    invalidEvents,
    events: events.sort((a, b) => {
      const startOrder = compareISODate(a.startDate, b.startDate);
      return startOrder || compareISODate(a.endDate, b.endDate);
    }),
  };
}
