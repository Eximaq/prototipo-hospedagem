import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runRemoteCalendarSync } from "../../../scripts/remote-calendar-sync-service";

const tempDirectories: string[] = [];

function validCalendar(uid: string, start: string, end: string) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calendar Sync Test//PT-BR",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    "DTSTAMP:20260101T000000Z",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    "SUMMARY:Private test event",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

async function createOutput(initialContent = "LAST_VALID_SNAPSHOT\n") {
  const directory = await mkdtemp(path.join(os.tmpdir(), "availability-sync-"));
  tempDirectories.push(directory);
  const outputPath = path.join(directory, "availability.json");
  await writeFile(outputPath, initialContent, "utf8");
  return outputPath;
}

function captureLogger() {
  const messages: string[] = [];
  return {
    messages,
    logger: {
      log: (message: string) => messages.push(message),
      error: (message: string) => messages.push(message),
    },
  };
}

afterEach(async () => {
  await Promise.all(
    tempDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("remote calendar synchronization", () => {
  it("fails safely when a required URL is missing", async () => {
    const outputPath = await createOutput();
    const { logger, messages } = captureLogger();

    const result = await runRemoteCalendarSync({
      env: { CASA_TURQUESA_ICAL_URL: "https://calendar.example.test/one.ics" },
      logger,
      outputPath,
    });

    expect(result.ok).toBe(false);
    expect(await readFile(outputPath, "utf8")).toBe("LAST_VALID_SNAPSHOT\n");
    expect(messages.join("\n")).toContain("Casa Corais");
  });

  it("preserves the entire last valid JSON when one house fails", async () => {
    const outputPath = await createOutput();
    const { logger, messages } = captureLogger();
    const requestedUrls: string[] = [];
    const turquesaUrl = "https://calendar.example.test/turquesa.ics?token=secret-a";
    const coraisUrl = "https://calendar.example.test/corais.ics?token=secret-b";
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url === turquesaUrl) {
        return new Response(validCalendar("one@test", "20260910", "20260915"), {
          status: 200,
          headers: { "content-type": "text/calendar" },
        });
      }
      return new Response("not found", { status: 404 });
    };

    const result = await runRemoteCalendarSync({
      env: {
        CASA_TURQUESA_ICAL_URL: turquesaUrl,
        CASA_CORAIS_ICAL_URL: coraisUrl,
      },
      fetchImpl,
      logger,
      outputPath,
    });
    const logs = messages.join("\n");

    expect(result.ok).toBe(false);
    expect(requestedUrls).toEqual([turquesaUrl, coraisUrl]);
    expect(await readFile(outputPath, "utf8")).toBe("LAST_VALID_SNAPSHOT\n");
    expect(logs).toContain("Casa Corais");
    expect(logs).toContain("último availability.json válido foi preservado");
    expect(logs).not.toContain("secret-a");
    expect(logs).not.toContain("secret-b");
    expect(logs).not.toContain("calendar.example.test");
  });

  it("atomically publishes both houses after a successful synchronization", async () => {
    const outputPath = await createOutput();
    const { logger, messages } = captureLogger();
    const fetchImpl: typeof fetch = async (input) => {
      const isTurquesa = String(input).includes("turquesa");
      return new Response(
        isTurquesa
          ? validCalendar("one@test", "20260910", "20260915")
          : validCalendar("two@test", "20261020", "20261024"),
        { status: 200, headers: { "content-type": "text/calendar" } },
      );
    };

    const result = await runRemoteCalendarSync({
      env: {
        CASA_TURQUESA_ICAL_URL: "https://calendar.example.test/turquesa.ics",
        CASA_CORAIS_ICAL_URL: "https://calendar.example.test/corais.ics",
      },
      fetchImpl,
      logger,
      outputPath,
      updatedAt: "2026-08-19T12:00:00.000Z",
    });
    const snapshot = JSON.parse(await readFile(outputPath, "utf8"));

    expect(result.ok).toBe(true);
    expect(snapshot.houses["casa-01"]).toEqual({
      houseId: "casa-01",
      updatedAt: "2026-08-19T12:00:00.000Z",
      unavailableRanges: [{ start: "2026-09-10", end: "2026-09-15" }],
    });
    expect(snapshot.houses["casa-02"]).toEqual({
      houseId: "casa-02",
      updatedAt: "2026-08-19T12:00:00.000Z",
      unavailableRanges: [{ start: "2026-10-20", end: "2026-10-24" }],
    });
    expect(messages.join("\n")).toContain(
      "Casa Turquesa: 1 eventos encontrados; 1 períodos indisponíveis",
    );
    expect(messages.join("\n")).toContain(
      "Casa Corais: 1 eventos encontrados; 1 períodos indisponíveis",
    );
  });
});
