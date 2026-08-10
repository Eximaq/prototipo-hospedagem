import { AvailabilitySection } from "@/components/sections/availability-section";
import { HouseShowcase } from "@/components/houses/house-showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Casas para temporada em Milagres",
  description:
    "Compare Casa Turquesa e Casa Corais Milagres, veja fotos, suítes, estrutura e consulte disponibilidade pelo WhatsApp.",
  path: "/casas/",
});

export default function HousesPage() {
  return (
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
  );
}
