import path from "node:path";
import { calendarSourceConfigs } from "./availability-config";
import {
  buildAvailabilitySnapshot,
  printGenerationSummary,
  writeAvailabilitySnapshot,
} from "./availability-generator";
import {
  CalendarSourceError,
  RemoteICSCalendarSource,
} from "../src/lib/availability/providers/calendar-source";

type SyncEnvironment = Record<string, string | undefined>;

export type SyncLogger = {
  log(message: string): void;
  error(message: string): void;
};

export type RemoteCalendarSyncOptions = {
  env?: SyncEnvironment;
  fetchImpl?: typeof fetch;
  logger?: SyncLogger;
  outputPath?: string;
  timeoutMs?: number;
  updatedAt?: string;
};

class CalendarConfigurationError extends Error {
  constructor(readonly label: string) {
    super(`Configuração ausente para ${label}.`);
    this.name = "CalendarConfigurationError";
  }
}

export function getSafeSyncFailureMessage(error: unknown) {
  if (
    !(error instanceof CalendarSourceError) &&
    !(error instanceof CalendarConfigurationError)
  ) {
    return (
      "Falha ao sincronizar os calendários das propriedades. " +
      "O último availability.json válido foi preservado."
    );
  }

  return (
    `Falha ao sincronizar calendário da ${error.label}. ` +
    "O último availability.json válido foi preservado."
  );
}

export async function syncRemoteCalendars(options: RemoteCalendarSyncOptions = {}) {
  const env = options.env || process.env;
  const sources = calendarSourceConfigs.map((config) => {
    const privateUrl = env[config.envVar]?.trim();
    if (!privateUrl) throw new CalendarConfigurationError(config.label);

    return new RemoteICSCalendarSource(privateUrl, {
      houseId: config.houseId,
      label: config.label,
      fetchImpl: options.fetchImpl,
      timeoutMs: options.timeoutMs,
    });
  });

  // Nothing is written until both sources have downloaded, parsed and validated.
  const { snapshot, summary } = await buildAvailabilitySnapshot(sources, options.updatedAt);
  const outputPath = await writeAvailabilitySnapshot(
    snapshot,
    options.outputPath || path.resolve("src/generated/availability.json"),
  );
  return { outputPath, snapshot, summary };
}

export async function runRemoteCalendarSync(options: RemoteCalendarSyncOptions = {}) {
  const logger = options.logger || console;
  try {
    const result = await syncRemoteCalendars(options);
    printGenerationSummary(result.outputPath, result.summary, (message) =>
      logger.log(message),
    );
    return { ok: true as const, ...result };
  } catch (error) {
    logger.error(getSafeSyncFailureMessage(error));
    return { ok: false as const };
  }
}
