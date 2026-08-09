import { houses } from "@/data/houses";

export function getHouseBySlug(slug: string) {
  return houses.find((house) => house.slug === slug);
}

export function getRelatedHouses(slug: string) {
  return houses.filter((house) => house.slug !== slug);
}

export function getBookingHouseOptions() {
  return houses.map((house) => ({
    id: house.id,
    slug: house.slug,
    label: house.label,
    name: house.name,
    locationLabel: house.location.label,
    guests: house.guests,
    suites: house.suites,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    pool: house.pool,
    barbecue: house.barbecue,
    highlights: house.highlights.slice(0, 2),
  }));
}
