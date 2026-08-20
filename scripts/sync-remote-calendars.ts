import { loadPrivateEnvFile } from "./load-private-env";
import { runRemoteCalendarSync } from "./remote-calendar-sync-service";

async function main() {
  await loadPrivateEnvFile();
  const result = await runRemoteCalendarSync();
  if (!result.ok) process.exitCode = 1;
}

main().catch(() => {
  console.error(
    "Falha ao carregar a configuração privada. O último availability.json válido foi preservado.",
  );
  process.exitCode = 1;
});
