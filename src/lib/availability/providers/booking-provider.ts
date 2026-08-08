import { ICalAvailabilityProvider } from "@/lib/availability/providers/ical-provider";
import type { AvailabilityProvider } from "@/lib/availability/types";

type BookingCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export class BookingAvailabilityProvider
  extends ICalAvailabilityProvider
  implements AvailabilityProvider
{
  constructor(calendars: BookingCalendar[]) {
    super(calendars, "booking");
  }
}
