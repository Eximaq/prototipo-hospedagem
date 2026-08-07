import { AvailabilitySection } from "@/components/sections/availability-section";
import { HouseShowcase } from "@/components/houses/house-showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "As casas",
  description:
    "Compare Casa Turquesa e Casa Corais Milagres, veja galerias e consulte disponibilidade pelo WhatsApp.",
  path: "/casas",
});

export default function HousesPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="px-4 pb-4 pt-24 md:px-6 md:pt-28 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            as="h1"
            eyebrow="As casas"
            title="Compare as duas opções antes de escolher sua estadia."
            description="Galerias, capacidade, comodidades e consulta pelo WhatsApp em uma experiência direta."
            compact
          />
        </div>
      </section>
      <HouseShowcase />
      <AvailabilitySection />
    </div>
  );
}
