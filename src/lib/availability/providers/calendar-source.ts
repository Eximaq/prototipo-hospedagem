import { readFile } from "node:fs/promises";
import { isValidDateRange } from "@/lib/availability/date-utils";
import { parseICS, type ParseICSOptions } from "@/lib/availability/parse-ical";
import type { CalendarSource } from "@/lib/availability/types";

type CalendarSourceOptions = {
  houseId: string;
  label: string;
  parseOptions?: ParseICSOptions;
};

type RemoteCalendarSourceOptions = CalendarSourceOptions & {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

export type CalendarSourceFailureCode =
  "invalid-url" | "network" | "timeout" | "http" | "content-type" | "empty" | "invalid-ics";

const DEFAULT_TIMEOUT_MS = 15_000;
const ACCEPTED_CONTENT_TYPES = [
  "text/calendar",
  "text/plain",
  "application/ics",
  "application/octet-stream",
];

export class CalendarSourceError extends Error {
  constructor(
    readonly label: string,
    readonly code: CalendarSourceFailureCode,
  ) {
    super(`Falha ao sincronizar calendário da ${label}.`);
    this.name = "CalendarSourceError";
  }
}

function hasCalendarEnvelope(content: string) {
  const normalized = content.replace(/^\uFEFF/, "").trim();
  return (
    /^BEGIN:VCALENDAR(?:\r?\n|$)/i.test(normalized) &&
    /(^|\r?\n)END:VCALENDAR$/i.test(normalized)
  );
}

function acceptsCalendarContentType(contentType: string | null) {
  if (!contentType) return true;
  const normalized = contentType.toLowerCase();
  return ACCEPTED_CONTENT_TYPES.some((accepted) => normalized.includes(accepted));
}

export class LocalICSCalendarSource implements CalendarSource {
  readonly houseId: string;
  readonly label: string;

  constructor(
    private readonly filePath: string,
    options: CalendarSourceOptions,
  ) {
    this.houseId = options.houseId;
    this.label = options.label;
    this.parseOptions = options.parseOptions;
  }

  private readonly parseOptions?: ParseICSOptions;

  async getEvents() {
    const content = await readFile(this.filePath, "utf8");
    return parseICS(content, this.parseOptions);
  }
}

export class RemoteICSCalendarSource implements CalendarSource {
  readonly houseId: string;
  readonly label: string;

  constructor(
    private readonly privateUrl: string,
    options: RemoteCalendarSourceOptions,
  ) {
    this.houseId = options.houseId;
    this.label = options.label;
    this.parseOptions = options.parseOptions;
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  private readonly parseOptions?: ParseICSOptions;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  async getEvents() {
    try {
      const url = new URL(this.privateUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("unsupported protocol");
      }
    } catch {
      throw new CalendarSourceError(this.label, "invalid-url");
    }

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new CalendarSourceError(this.label, "timeout"));
      }, this.timeoutMs);
    });

    const request = async () => {
      let response: Response;
      try {
        response = await this.fetchImpl(this.privateUrl, {
          headers: { accept: "text/calendar,text/plain,*/*" },
          signal: controller.signal,
        });
      } catch {
        throw new CalendarSourceError(this.label, "network");
      }

      if (!response.ok) throw new CalendarSourceError(this.label, "http");
      if (!acceptsCalendarContentType(response.headers.get("content-type"))) {
        throw new CalendarSourceError(this.label, "content-type");
      }

      let content: string;
      try {
        content = await response.text();
      } catch {
        throw new CalendarSourceError(this.label, "network");
      }

      if (!content.trim()) throw new CalendarSourceError(this.label, "empty");
      if (!hasCalendarEnvelope(content)) {
        throw new CalendarSourceError(this.label, "invalid-ics");
      }
      const normalizedContent = content.replace(/^\uFEFF/, "").trim();

      let parsed: ReturnType<typeof parseICS>;
      try {
        parsed = parseICS(normalizedContent, this.parseOptions);
      } catch {
        throw new CalendarSourceError(this.label, "invalid-ics");
      }

      const hasInvalidDates = parsed.events.some(
        (event) => !isValidDateRange(event.startDate, event.endDate),
      );
      if (!parsed.eventsFound || parsed.invalidEvents || hasInvalidDates) {
        throw new CalendarSourceError(this.label, "invalid-ics");
      }

      return parsed;
    };

    try {
      return await Promise.race([request(), timeout]);
    } catch (error) {
      if (error instanceof CalendarSourceError) throw error;
      throw new CalendarSourceError(this.label, "network");
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
