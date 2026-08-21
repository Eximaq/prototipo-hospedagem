import Script from "next/script";
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
import { siteConfig } from "@/data/site-config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Casas para temporada em São Miguel dos Milagres",
  description:
    "Conheça a Casa Turquesa e a Casa Corais Milagres, compare suítes, estrutura, fotos e consulte disponibilidade pelo WhatsApp.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Miguel dos Milagres",
      addressRegion: "AL",
      addressCountry: "BR",
    },
    priceRange: "Sob consulta",
  };

  return (
    <>
      <Script
        id="lodging-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
