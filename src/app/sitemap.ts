import type { MetadataRoute } from "next";
import { houses } from "@/data/houses";
import { siteConfig } from "@/data/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const houseRoutes = houses.map((house) => `/casas/${house.slug}/`);
  const publicRoutes = ["/", "/casas/", ...houseRoutes, "/contato/"];

  return publicRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
  }));
}
