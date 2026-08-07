import { houses } from "@/data/houses";

export function getHouseBySlug(slug: string) {
  return houses.find((house) => house.slug === slug);
}

export function getRelatedHouses(slug: string) {
  return houses.filter((house) => house.slug !== slug);
}
