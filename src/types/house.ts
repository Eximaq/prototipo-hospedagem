import type { ExternalCalendar } from "@/lib/availability/types";

export type HouseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HouseFact = {
  label: string;
  value: string;
};

export type HouseLocation = {
  label: string;
  mapQuery: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  googleMapsUrl?: string;
  wazeUrl?: string;
};

export type HouseHero = {
  type: "image" | "video";
  image: string;
  video?: {
    mp4?: string;
    webm?: string;
    poster: string;
  };
};

export type House = {
  id: string;
  slug: string;
  label: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  location: HouseLocation;
  hero: HouseHero;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pool: boolean;
  amenities: string[];
  highlights: string[];
  rules: string[];
  usefulInfo: string[];
  images: HouseImage[];
  featured: boolean;
  instagram?: string;
  externalCalendars: ExternalCalendar[];
};

export type Testimonial = {
  name: string;
  context: string;
  quote: string;
};

export type Experience = {
  title: string;
  description: string;
};
