import Script from "next/script";
import { AmenitiesSection } from "@/components/sections/amenities-section";
import { AvailabilitySection } from "@/components/sections/availability-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HouseShowcase } from "@/components/houses/house-showcase";
import { LocationSection } from "@/components/sections/location-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { siteConfig } from "@/data/site-config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Casas premium para temporada em Milagres",
  description:
    "Conheça duas casas em São Miguel dos Milagres, compare fotos, capacidade e comodidades, e consulte disponibilidade pelo WhatsApp.",
});

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: siteConfig.name,
    ...(siteConfig.url
      ? {
          url: siteConfig.url,
          image: `${siteConfig.url}${siteConfig.ogImage}`,
        }
      : {}),
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Endereço exato sob consulta",
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
      <ExperienceSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <LocationSection />
      <AvailabilitySection />
    </>
  );
}
