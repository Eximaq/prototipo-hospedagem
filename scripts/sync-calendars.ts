import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { externalCalendars } from "../src/data/external-calendars";
import { normalizeReservations } from "../src/lib/availability/normalize";
import { parseICalendar } from "../src/lib/availability/providers/ical-provider";
import type { Reservation, ReservationSource } from "../src/lib/availability/types";

const outputPath = path.resolve("src/generated/availability.json");

function providerToSource(provider: string): ReservationSource {
  if (provider === "airbnb") return "airbnb";
  if (provider === "booking") return "booking";
  if (provider === "vrbo") return "vrbo";
  if (provider === "google-calendar") return "google-calendar";
  if (provider === "ical") return "ical";
  return "other";
}

async function fetchICal(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: "text/calendar,text/plain,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar (${response.status})`);
  }

  return response.text();
}

async function collectExternalReservations() {
  const reservations: Reservation[] = [];

  for (const calendar of externalCalendars.filter((item) => item.enabled)) {
    const url = calendar.envVar ? process.env[calendar.envVar] : calendar.url;
    if (!url) {
      console.warn(
        `Skipping ${calendar.name}: missing ${calendar.envVar || "calendar URL"}.`,
      );
      continue;
    }

    const content = await fetchICal(url);
    reservations.push(
      ...parseICalendar(
        content,
        calendar.houseId,
        providerToSource(calendar.provider),
        calendar.name,
      ),
    );
  }

  return normalizeReservations(reservations);
}

async function main() {
  const reservations = await collectExternalReservations();
  const payload = {
    generatedAt: new Date().toISOString(),
    reservations,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(`${outputPath}.tmp`, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await rename(`${outputPath}.tmp`, outputPath);

  console.log(
    `Generated ${path.relative(process.cwd(), outputPath)} with ${reservations.length} external reservations.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
