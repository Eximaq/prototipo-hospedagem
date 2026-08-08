import type { ExternalCalendar } from "@/lib/availability/types";

export const externalCalendars: ExternalCalendar[] = [
  {
    id: "airbnb-casa-turquesa",
    houseId: "casa-01",
    name: "Airbnb - Casa Turquesa",
    provider: "airbnb",
    enabled: false,
    envVar: "AIRBNB_CASA_TURQUESA_ICAL_URL",
  },
  {
    id: "booking-casa-turquesa",
    houseId: "casa-01",
    name: "Booking - Casa Turquesa",
    provider: "booking",
    enabled: false,
    envVar: "BOOKING_CASA_TURQUESA_ICAL_URL",
  },
  {
    id: "vrbo-casa-turquesa",
    houseId: "casa-01",
    name: "Vrbo - Casa Turquesa",
    provider: "vrbo",
    enabled: false,
    envVar: "VRBO_CASA_TURQUESA_ICAL_URL",
  },
  {
    id: "airbnb-casa-corais",
    houseId: "casa-02",
    name: "Airbnb - Casa Corais Milagres",
    provider: "airbnb",
    enabled: false,
    envVar: "AIRBNB_CASA_CORAIS_ICAL_URL",
  },
  {
    id: "booking-casa-corais",
    houseId: "casa-02",
    name: "Booking - Casa Corais Milagres",
    provider: "booking",
    enabled: false,
    envVar: "BOOKING_CASA_CORAIS_ICAL_URL",
  },
  {
    id: "vrbo-casa-corais",
    houseId: "casa-02",
    name: "Vrbo - Casa Corais Milagres",
    provider: "vrbo",
    enabled: false,
    envVar: "VRBO_CASA_CORAIS_ICAL_URL",
  },
];

export function getExternalCalendarsForHouse(houseId: string) {
  return externalCalendars.filter((calendar) => calendar.houseId === houseId);
}
