import { ICalAvailabilityProvider } from "@/lib/availability/providers/ical-provider";
import type { AvailabilityProvider } from "@/lib/availability/types";

type VrboCalendar = {
  houseId: string;
  sourceName?: string;
  content?: string;
};

export class VrboAvailabilityProvider
  extends ICalAvailabilityProvider
  implements AvailabilityProvider
{
  constructor(calendars: VrboCalendar[]) {
    super(calendars, "vrbo");
  }
}
