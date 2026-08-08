import type { AvailabilityProvider, Reservation } from "@/lib/availability/types";

export class LocalAvailabilityProvider implements AvailabilityProvider {
  constructor(private readonly reservations: Reservation[]) {}

  async getReservations(houseId: string) {
    return this.reservations.filter((reservation) => reservation.houseId === houseId);
  }
}
