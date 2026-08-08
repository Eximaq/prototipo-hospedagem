import { ICalAvailabilityProvider } from "@/lib/availability/providers/ical-provider";
import type { AvailabilityProvider } from "@/lib/availability/types";

type AirbnbCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export class AirbnbAvailabilityProvider
  extends ICalAvailabilityProvider
  implements AvailabilityProvider
{
  constructor(calendars: AirbnbCalendar[]) {
    super(calendars, "airbnb");
  }
}
