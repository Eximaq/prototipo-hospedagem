import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { isValidDateRange } from "../src/lib/availability/date-utils";
import { mergeUnavailableRanges } from "../src/lib/availability/merge";
import type {
  CalendarSource,
  GeneratedAvailabilitySnapshot,
} from "../src/lib/availability/types";

export type AvailabilityGenerationSummary = {
  houseId: string;
  label: string;
  eventsFound: number;
  unavailableRangeCount: number;
};

export async function buildAvailabilitySnapshot(
  sources: CalendarSource[],
  updatedAt = new Date().toISOString(),
) {
  const snapshot: GeneratedAvailabilitySnapshot = {
    updatedAt,
    houses: {},
  };
  const summary: AvailabilityGenerationSummary[] = [];
  const seenHouseIds = new Set<string>();

  for (const source of sources) {
    if (!source.houseId || seenHouseIds.has(source.houseId)) {
      throw new Error(`Configuração de calendário inválida para ${source.label}.`);
    }
    seenHouseIds.add(source.houseId);

    const parsed = await source.getEvents();
    if (
      parsed.invalidEvents ||
      parsed.events.some((event) => !isValidDateRange(event.startDate, event.endDate))
    ) {
      throw new Error(`Calendário inválido para ${source.label}.`);
    }
    const unavailableRanges = mergeUnavailableRanges(
      parsed.events.map((event) => ({
        startDate: event.startDate,
        endDate: event.endDate,
      })),
    );

    snapshot.houses[source.houseId] = {
      houseId: source.houseId,
      updatedAt,
      unavailableRanges: unavailableRanges.map((range) => ({
        start: range.startDate,
        end: range.endDate,
      })),
    };
    summary.push({
      houseId: source.houseId,
      label: source.label,
      eventsFound: parsed.eventsFound,
      unavailableRangeCount: unavailableRanges.length,
    });
  }

  return { snapshot, summary };
}

export async function writeAvailabilitySnapshot(
  snapshot: GeneratedAvailabilitySnapshot,
  outputPath = path.resolve("src/generated/availability.json"),
) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
  return outputPath;
}

export function printGenerationSummary(
  outputPath: string,
  summary: AvailabilityGenerationSummary[],
  log: (message: string) => void = console.log,
) {
  for (const item of summary) {
    log(
      `${item.label}: ${item.eventsFound} eventos encontrados; ` +
        `${item.unavailableRangeCount} períodos indisponíveis após normalização.`,
    );
  }
  log(`Disponibilidade pública gerada em ${path.relative(process.cwd(), outputPath)}.`);
}
