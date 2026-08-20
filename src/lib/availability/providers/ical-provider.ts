import { parseICS } from "@/lib/availability/parse-ical";
import { normalizeReservations } from "@/lib/availability/normalize";
import type {
  AvailabilityProvider,
  Reservation,
  ReservationSource,
} from "@/lib/availability/types";

type ICalProviderCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export function parseICalendar(
  content: string,
  houseId: string,
  source: ReservationSource = "ical",
  sourceName?: string,
) {
  const reservations = parseICS(content).events.map((event, index) => {
    const externalId = event.uid || `${houseId}-${event.startDate}-${event.endDate}-${index}`;

    return {
      id: `${source}-${externalId}`.replace(/[^a-zA-Z0-9_.:-]/g, "-"),
      houseId,
      startDate: event.startDate,
      endDate: event.endDate,
      source,
      status: "confirmed",
      externalId,
      metadata: sourceName ? { sourceName } : undefined,
    } satisfies Reservation;
  });

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
