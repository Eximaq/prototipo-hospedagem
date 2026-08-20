import { calendarSourceConfigs } from "./availability-config";
import {
  buildAvailabilitySnapshot,
  printGenerationSummary,
  writeAvailabilitySnapshot,
} from "./availability-generator";
import { LocalICSCalendarSource } from "../src/lib/availability/providers/calendar-source";

async function main() {
  const sources = calendarSourceConfigs.map(
    (config) =>
      new LocalICSCalendarSource(config.fixturePath, {
        houseId: config.houseId,
        label: config.label,
      }),
  );
  const { snapshot, summary } = await buildAvailabilitySnapshot(sources);
  const outputPath = await writeAvailabilitySnapshot(snapshot);
  printGenerationSummary(outputPath, summary);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erro desconhecido";
  console.error(`Falha ao gerar disponibilidade: ${message}`);
  process.exitCode = 1;
});
