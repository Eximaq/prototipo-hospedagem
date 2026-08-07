import { AvailabilityForm } from "@/components/booking/availability-form";
import { houses } from "@/data/houses";

export function WhatsAppInquiryForm({ propertyName }: { propertyName?: string }) {
  const selectedHouseSlug = houses.find((house) => house.name === propertyName)?.slug;

  return <AvailabilityForm selectedHouseSlug={selectedHouseSlug} />;
}
