import { describe, expect, it } from "vitest";
import { houses } from "@/data/houses";
import { pageSeo } from "@/data/seo-content";
import {
  createContactStructuredData,
  createHomeStructuredData,
  createHouseStructuredData,
  createHousesStructuredData,
} from "@/lib/structured-data";

const officialOrigin = "https://casasmilagres.com.br";

describe("structured data", () => {
  it("describes the organization and website on the homepage", () => {
    expect(createHomeStructuredData()).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${officialOrigin}/#organization`,
          name: "Casas Milagres",
        },
        {
          "@type": "WebSite",
          "@id": `${officialOrigin}/#website`,
          url: `${officialOrigin}/`,
          inLanguage: "pt-BR",
        },
      ],
    });
  });

  it("describes the public house collection without duplicating listings", () => {
    expect(createHousesStructuredData()).toMatchObject({
      "@type": "CollectionPage",
      url: `${officialOrigin}/casas/`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: houses.length,
        itemListElement: houses.map((house, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: house.name,
          url: `${officialOrigin}/casas/${house.slug}/`,
        })),
      },
    });
  });

  it.each(houses)("uses only real data for $name", (house) => {
    const structuredData = createHouseStructuredData(house);

    expect(structuredData).toMatchObject({
      "@graph": [
        {
          "@type": "VacationRental",
          "@id": `${officialOrigin}/casas/${house.slug}/#vacation-rental`,
          identifier: house.id,
          name: house.name,
          url: `${officialOrigin}/casas/${house.slug}/`,
          image: house.images.map((image) => `${officialOrigin}${image.src}`),
          latitude: house.location.latitude,
          longitude: house.location.longitude,
          containsPlace: {
            "@type": "Accommodation",
            occupancy: {
              "@type": "QuantitativeValue",
              value: house.guests,
            },
            numberOfBedrooms: house.bedrooms,
            numberOfBathroomsTotal: house.bathrooms,
            petsAllowed: false,
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              position: 1,
              item: `${officialOrigin}/`,
            },
            {
              position: 2,
              item: `${officialOrigin}/casas/`,
            },
            {
              position: 3,
              item: `${officialOrigin}/casas/${house.slug}/`,
            },
          ],
        },
      ],
    });

    const serializedData = JSON.stringify(structuredData);
    expect(serializedData).not.toMatch(
      /aggregateRating|reviewCount|"review"|"offers"|priceCurrency|availability/,
    );
  });

  it("describes the contact page as part of the official website", () => {
    expect(createContactStructuredData()).toMatchObject({
      "@type": "ContactPage",
      url: `${officialOrigin}/contato/`,
      description: pageSeo.contact.description,
      isPartOf: {
        "@id": `${officialOrigin}/#website`,
      },
    });
  });
});
