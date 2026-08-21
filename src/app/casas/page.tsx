import { AvailabilitySection } from "@/components/sections/availability-section";
import { HouseShowcase } from "@/components/houses/house-showcase";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageSeo } from "@/data/seo-content";
import { createMetadata } from "@/lib/seo";
import { createHousesStructuredData } from "@/lib/structured-data";

export const metadata = createMetadata({
  ...pageSeo.houses,
  path: "/casas/",
});

export default function HousesPage() {
  return (
    <>
      <JsonLd id="houses-structured-data" data={createHousesStructuredData()} />
      <div className="bg-[var(--color-paper)]">
        <section className="px-4 pb-4 pt-24 md:px-6 md:pt-28 xl:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              as="h1"
              eyebrow="Casas Milagres"
              title="Compare Casa Turquesa e Casa Corais Milagres."
              description="Veja fotos reais, estrutura principal e escolha a casa mais adequada para sua viagem."
              compact
            />
          </div>
        </section>
        <HouseShowcase />
        <AvailabilitySection />
      </div>
    </>
  );
}
