import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

const defaultSeoImage = {
  src: siteConfig.ogImage,
  alt: "Casa de temporada com piscina em São Miguel dos Milagres",
  width: 3840,
  height: 2558,
};

export function createMetadata({
  title,
  description,
  path = "/",
  image = defaultSeoImage,
}: SeoInput): Metadata {
  const brandedTitle = `${title} | ${siteConfig.shortName}`;
  const canonicalUrl = new URL(path, siteConfig.url).toString();
  const imageUrl = new URL(image.src, siteConfig.url).toString();

  return {
    title: {
      absolute: brandedTitle,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: brandedTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
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
