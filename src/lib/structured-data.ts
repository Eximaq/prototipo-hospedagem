import { houses } from "@/data/houses";
import { pageSeo } from "@/data/seo-content";
import { siteConfig } from "@/data/site-config";
import type { House } from "@/types/house";

const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function hasAmenity(house: House, terms: string[]) {
  return house.amenities.some((amenity) => {
    const normalizedAmenity = amenity.toLocaleLowerCase("pt-BR");
    return terms.some((term) => normalizedAmenity.includes(term));
  });
}

function getAmenityFeatures(house: House) {
  const beachDistance = house.location.distances?.find(
    (distance) => distance.label === "Praia",
  )?.value;

  return [
    { name: "wifi", value: hasAmenity(house, ["wi-fi"]) },
    {
      name: "ac",
      value: hasAmenity(house, ["ar-condicionado", "climatizada"]),
    },
    { name: "kitchen", value: hasAmenity(house, ["cozinha equipada"]) },
    { name: "outdoorGrill", value: house.barbecue },
    { name: "pool", value: house.pool },
    { name: "beachAccess", value: Boolean(beachDistance) },
    {
      name: "gymFitnessEquipment",
      value: hasAmenity(house, ["academia"]),
    },
    { name: "tv", value: hasAmenity(house, ["smart tv"]) },
  ]
    .filter((feature) => feature.value)
    .map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature.name,
      value: feature.value,
    }));
}

export function createHomeStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.shortName,
        url: `${siteConfig.url}/`,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: {
          "@type": "Place",
          name: "São Miguel dos Milagres, Alagoas, Brasil",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteConfig.url}/`,
        name: siteConfig.shortName,
        description: pageSeo.home.description,
        inLanguage: "pt-BR",
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };
}

export function createHousesStructuredData(): Record<string, unknown> {
  const canonicalUrl = absoluteUrl("/casas/");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageSeo.houses.title,
    description: pageSeo.houses.description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": websiteId,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: houses.length,
      itemListElement: houses.map((house, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: house.name,
        url: absoluteUrl(`/casas/${house.slug}/`),
      })),
    },
  };
}

export function createHouseStructuredData(house: House): Record<string, unknown> {
  const canonicalUrl = absoluteUrl(`/casas/${house.slug}/`);
  const coordinates =
    typeof house.location.latitude === "number" &&
    typeof house.location.longitude === "number"
      ? {
          latitude: house.location.latitude,
          longitude: house.location.longitude,
        }
      : {};

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VacationRental",
        "@id": `${canonicalUrl}#vacation-rental`,
        additionalType: "House",
        identifier: house.id,
        name: house.name,
        description: house.fullDescription,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        image: house.images.map((image) => absoluteUrl(image.src)),
        ...coordinates,
        address: {
          "@type": "PostalAddress",
          addressLocality: "São Miguel dos Milagres",
          addressRegion: "AL",
          addressCountry: "BR",
        },
        containsPlace: {
          "@type": "Accommodation",
          additionalType: "EntirePlace",
          ...(house.guests
            ? {
                occupancy: {
                  "@type": "QuantitativeValue",
                  value: house.guests,
                },
              }
            : {}),
          numberOfBedrooms: house.bedrooms,
          numberOfBathroomsTotal: house.bathrooms,
          petsAllowed: false,
          amenityFeature: getAmenityFeatures(house),
        },
        ...(house.instagram ? { sameAs: [house.instagram] } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: `${siteConfig.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Casas",
            item: absoluteUrl("/casas/"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: house.name,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}

export function createContactStructuredData(): Record<string, unknown> {
  const canonicalUrl = absoluteUrl("/contato/");

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageSeo.contact.title,
    description: pageSeo.contact.description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": organizationId,
    },
  };
}
