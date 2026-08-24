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

describe("house stay and staff rules", () => {
  it("keeps Casa Turquesa at a 4-night minimum with no maximum", () => {
    const house = houses.find((entry) => entry.slug === "casa-turquesa-05");

    expect(house?.minNights).toBe(4);
    expect(house?.maxNights).toBeNull();
    expect(house?.policies).toContainEqual({
      label: "Noites máximas",
      value: "Sem limite máximo de noites",
    });
    expect(house?.amenities.join(" ")).toContain("Duas funcionárias");
    expect(house?.amenities.join(" ")).toContain("das 8h às 15h");
  });

  it("keeps Casa Corais at a 2-night minimum with no maximum", () => {
    const house = houses.find((entry) => entry.slug === "casa-corais-milagres");

    expect(house?.minNights).toBe(2);
    expect(house?.maxNights).toBeNull();
    expect(house?.policies).toContainEqual({
      label: "Noites máximas",
      value: "Sem limite máximo de noites",
    });
    expect(house?.amenities.join(" ")).toContain("Uma funcionária");
    expect(house?.amenities.join(" ")).toContain("das 8h às 15h");
  });
});
