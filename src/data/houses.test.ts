import { describe, expect, it } from "vitest";
import { houses } from "@/data/houses";
import { buildWazeCoordinatesUrl } from "@/lib/maps";

const expectedLocations = [
  {
    slug: "casa-turquesa-05",
    residence: "Huna Residence",
    googlePlace: "Huna+Residence",
    latitude: -9.3054049,
    longitude: -35.4063443,
  },
  {
    slug: "casa-corais-milagres",
    residence: "Naluum Residence",
    googlePlace: "Naluum+Residence",
    latitude: -9.2933771,
    longitude: -35.3972914,
  },
] as const;

describe("house locations", () => {
  it.each(expectedLocations)(
    "keeps the exact map location for $slug",
    ({ slug, residence, googlePlace, latitude, longitude }) => {
      const house = houses.find((entry) => entry.slug === slug);

      expect(house?.location.address).toContain(residence);
      expect(house?.location.mapQuery).toBe(`${latitude},${longitude}`);
      expect(house?.location.latitude).toBe(latitude);
      expect(house?.location.longitude).toBe(longitude);
      expect(house?.location.googleMapsUrl).toContain(googlePlace);
      expect(buildWazeCoordinatesUrl(latitude, longitude)).toContain(
        `ll=${latitude},${longitude}`,
      );
    },
  );
});
