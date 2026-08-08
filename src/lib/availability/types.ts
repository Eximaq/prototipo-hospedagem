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
