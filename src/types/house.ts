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

export type House = {
  id: string;
  slug: string;
  label: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  mapQuery: string;
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
