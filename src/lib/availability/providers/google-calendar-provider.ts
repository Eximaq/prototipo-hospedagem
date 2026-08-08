import { ICalAvailabilityProvider } from "@/lib/availability/providers/ical-provider";
import type { AvailabilityProvider } from "@/lib/availability/types";

type GoogleCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export class GoogleCalendarAvailabilityProvider
  extends ICalAvailabilityProvider
  implements AvailabilityProvider
{
  constructor(calendars: GoogleCalendar[]) {
    super(calendars, "google-calendar");
  }
}
