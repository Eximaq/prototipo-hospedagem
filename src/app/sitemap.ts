import type { MetadataRoute } from "next";
import { houses } from "@/data/houses";
import { siteConfig } from "@/data/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/casas", "/contato"];
  const houseRoutes = houses.map((house) => `/casas/${house.slug}`);

  return [...staticRoutes, ...houseRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
