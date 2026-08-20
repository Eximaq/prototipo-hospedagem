export type ReservationSource =
  | "manual"
  | "direct"
  | "airbnb"
  | "booking"
  | "vrbo"
  | "google-calendar"
  | "ical"
  | "other";

export type ReservationStatus =
  | "confirmed"
  | "blocked"
  | "pending"
  | "cancelled";

export type Reservation = {
  id: string;
  houseId: string;
  startDate: string;
  endDate: string;
  source: ReservationSource;
  status: ReservationStatus;
  externalId?: string;
  createdAt?: string;
  metadata?: {
    sourceName?: string;
  };
};

export type AvailabilityRange = {
  startDate: string;
  endDate: string;
};

export type CalendarEvent = {
  uid?: string;
  startDate: string;
  endDate: string;
  status: "confirmed" | "tentative" | "cancelled";
};

export type CalendarParseResult = {
  eventsFound: number;
  events: CalendarEvent[];
  cancelledEvents?: number;
  invalidEvents?: number;
};

export type GeneratedUnavailableRange = {
  start: string;
  end: string;
};

export type GeneratedHouseAvailability = {
  houseId: string;
  updatedAt: string | null;
  unavailableRanges: GeneratedUnavailableRange[];
};

export type GeneratedAvailabilitySnapshot = {
  updatedAt: string | null;
  houses: Record<string, GeneratedHouseAvailability>;
};

export type ExternalCalendarProvider =
  | "airbnb"
  | "booking"
  | "vrbo"
  | "google-calendar"
  | "ical";

export type ExternalCalendar = {
  id: string;
  houseId: string;
  name: string;
  provider: ExternalCalendarProvider;
  enabled: boolean;
  envVar?: string;
  url?: string;
};

export type PublicHouseAvailability = {
  houseId: string;
  unavailableRanges: AvailabilityRange[];
};

export type AvailabilityMergeOptions = {
  houseId?: string;
  pendingBlocks?: boolean;
};

export interface AvailabilityProvider {
  getReservations(houseId: string): Promise<Reservation[]>;
}

export interface CalendarSource {
  readonly houseId: string;
  readonly label: string;
  getEvents(): Promise<CalendarParseResult>;
}
