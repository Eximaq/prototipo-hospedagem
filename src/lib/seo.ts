import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.ogImage,
}: SeoInput): Metadata {
  const canonicalUrl = siteConfig.url ? new URL(path, siteConfig.url) : undefined;
  const imageUrl = siteConfig.url ? new URL(image, siteConfig.url).toString() : undefined;

  return {
    title,
    description,
    ...(canonicalUrl
      ? {
          alternates: {
            canonical: canonicalUrl,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
