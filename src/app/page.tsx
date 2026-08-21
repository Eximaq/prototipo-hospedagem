import { AmenitiesSection } from "@/components/sections/amenities-section";
import { AvailabilitySection } from "@/components/sections/availability-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HouseComparisonSection } from "@/components/sections/house-comparison-section";
import { HouseShowcase } from "@/components/houses/house-showcase";
import { LocationSection } from "@/components/sections/location-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrustSection } from "@/components/sections/trust-section";
import { JsonLd } from "@/components/seo/json-ld";
import { pageSeo } from "@/data/seo-content";
import { createMetadata } from "@/lib/seo";
import { createHomeStructuredData } from "@/lib/structured-data";

export const metadata = createMetadata({
  ...pageSeo.home,
});

const homeFaq = [
  {
    question: "Como consultar disponibilidade?",
    answer:
      "Escolha a casa, informe entrada, saída e hóspedes. O formulário envia uma mensagem organizada para o WhatsApp.",
  },
  {
    question: "As casas têm piscina, Wi-Fi e churrasqueira?",
    answer: "Sim. As duas casas contam com piscina, Wi-Fi e churrasqueira.",
  },
  {
    question: "Qual casa combina melhor com grupos maiores?",
    answer:
      "A Casa Turquesa recebe até 14 pessoas e possui 7 suítes. A Casa Corais Milagres recebe até 8 pessoas em 3 suítes climatizadas.",
  },
  {
    question: "As casas aceitam pets?",
    answer: "Não. Casa Turquesa e Casa Corais Milagres não aceitam pets.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd id="home-structured-data" data={createHomeStructuredData()} />
      <PremiumHero />
      <HouseShowcase />
      <HouseComparisonSection />
      <ExperienceSection />
      <AmenitiesSection />
      <TrustSection />
      <LocationSection />
      <FaqSection items={homeFaq} tone="shell" />
      <TestimonialsSection />
      <AvailabilitySection />
    </>
  );
}
