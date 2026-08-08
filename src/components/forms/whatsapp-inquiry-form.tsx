import { AvailabilityForm } from "@/components/booking/availability-form";
import { houses } from "@/data/houses";
import { getPublicAvailability } from "@/lib/availability";
import { getBookingHouseOptions } from "@/lib/data";

export function WhatsAppInquiryForm({ propertyName }: { propertyName?: string }) {
  const selectedHouseSlug = houses.find((house) => house.name === propertyName)?.slug;

  return (
    <AvailabilityForm
      selectedHouseSlug={selectedHouseSlug}
      houses={getBookingHouseOptions()}
      availability={getPublicAvailability()}
    />
  );
}
