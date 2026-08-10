import { AvailabilityForm } from "@/components/booking/availability-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicAvailability } from "@/lib/availability";
import { getBookingHouseOptions } from "@/lib/data";

export function AvailabilitySection() {
  const houses = getBookingHouseOptions();
  const availability = getPublicAvailability();

  return (
    <section
      id="consultar"
      className="section-anchor bg-[var(--color-paper)] px-4 py-10 md:px-6 md:py-14 xl:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 max-w-3xl">
          <SectionHeading
            eyebrow="Consulta"
            title="Escolha sua casa e comece a planejar seus dias em Milagres."
            description="Primeiro selecione casa, datas e hóspedes. Depois envie uma consulta objetiva pelo WhatsApp."
            compact
          />
        </div>
        <AvailabilityForm houses={houses} availability={availability} layout="horizontal" />
      </div>
    </section>
  );
}
