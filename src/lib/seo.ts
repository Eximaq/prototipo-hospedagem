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
  const canonicalUrl = new URL(path, siteConfig.url).toString();
  const imageUrl = new URL(image, siteConfig.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createRedirectMetadata(destination: string): Metadata {
  return {
    alternates: {
      canonical: new URL(destination, siteConfig.url).toString(),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}
