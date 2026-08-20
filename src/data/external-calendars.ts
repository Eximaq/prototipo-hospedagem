import type { ExternalCalendar } from "@/lib/availability/types";

export const externalCalendars: ExternalCalendar[] = [
  {
    id: "ical-casa-turquesa",
    houseId: "casa-01",
    name: "iCal - Casa Turquesa",
    provider: "ical",
    enabled: false,
    envVar: "CASA_TURQUESA_ICAL_URL",
  },
  {
    id: "ical-casa-corais",
    houseId: "casa-02",
    name: "iCal - Casa Corais",
    provider: "ical",
    enabled: false,
    envVar: "CASA_CORAIS_ICAL_URL",
  },
];

export function getExternalCalendarsForHouse(houseId: string) {
  return externalCalendars.filter((calendar) => calendar.houseId === houseId);
}
