import { addDays, parseICalDateValue } from "@/lib/availability/date-utils";
import { normalizeReservations } from "@/lib/availability/normalize";
import type {
  AvailabilityProvider,
  Reservation,
  ReservationSource,
} from "@/lib/availability/types";

type ParsedLine = {
  name: string;
  params: Record<string, string>;
  value: string;
};

type ICalProviderCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export function unfoldICalendarLines(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .reduce<string[]>((lines, line) => {
      if (/^[ \t]/.test(line) && lines.length) {
        lines[lines.length - 1] += line.slice(1);
      } else if (line.trim()) {
        lines.push(line.trimEnd());
      }
      return lines;
    }, []);
}

function parseLine(line: string): ParsedLine | null {
  const separator = line.indexOf(":");
  if (separator < 0) return null;

  const left = line.slice(0, separator);
  const value = line.slice(separator + 1);
  const [rawName, ...rawParams] = left.split(";");
  const params = Object.fromEntries(
    rawParams.map((param) => {
      const [key, ...valueParts] = param.split("=");
      return [key.toUpperCase(), valueParts.join("=")];
    }),
  );

  return {
    name: rawName.toUpperCase(),
    params,
    value,
  };
}

function getEventBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let current: string[] | null = null;

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    if (parsed.name === "BEGIN" && parsed.value.toUpperCase() === "VEVENT") {
      current = [];
      continue;
    }

    if (parsed.name === "END" && parsed.value.toUpperCase() === "VEVENT") {
      if (current) blocks.push(current);
      current = null;
      continue;
    }

    current?.push(line);
  }

  return blocks;
}

function toReservation(
  lines: string[],
  houseId: string,
  source: ReservationSource,
  sourceName?: string,
): Reservation | null {
  const event = new Map<string, ParsedLine>();

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    if (!event.has(parsed.name)) event.set(parsed.name, parsed);
  }

  const status = event.get("STATUS")?.value.toUpperCase();
  if (status === "CANCELLED") return null;

  const startDate = parseICalDateValue(event.get("DTSTART")?.value || "");
  const endDate =
    parseICalDateValue(event.get("DTEND")?.value || "") ||
    (startDate ? addDays(startDate, 1) : null);

  if (!startDate || !endDate) return null;

  const uid = event.get("UID")?.value.trim();
  const externalId = uid || `${source}-${houseId}-${startDate}-${endDate}`;
  const id = `${source}-${externalId}`.replace(/[^a-zA-Z0-9_.:-]/g, "-");

  return {
    id,
    houseId,
    startDate,
    endDate,
    source,
    status: "confirmed",
    externalId,
    metadata: sourceName ? { sourceName } : undefined,
  } satisfies Reservation;
}

export function parseICalendar(
  content: string,
  houseId: string,
  source: ReservationSource = "ical",
  sourceName?: string,
) {
  const lines = unfoldICalendarLines(content);
  const reservations = getEventBlocks(lines)
    .map((block) => toReservation(block, houseId, source, sourceName))
    .filter((reservation): reservation is Reservation => Boolean(reservation));

  return normalizeReservations(reservations);
}

export class ICalAvailabilityProvider implements AvailabilityProvider {
  constructor(
    private readonly calendars: ICalProviderCalendar[],
    private readonly source: ReservationSource = "ical",
  ) {}

  async getReservations(houseId: string) {
    return this.calendars
      .filter((calendar) => calendar.houseId === houseId)
      .flatMap((calendar) =>
        calendar.content
          ? parseICalendar(calendar.content, houseId, this.source, calendar.sourceName)
          : [],
      );
  }
}
