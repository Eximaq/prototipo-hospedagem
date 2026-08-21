import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/data/site-config";
import { createMetadata, createRedirectMetadata } from "@/lib/seo";

const officialOrigin = "https://casasmilagres.com.br";
const expectedUrls = [
  `${officialOrigin}/`,
  `${officialOrigin}/casas/`,
  `${officialOrigin}/casas/casa-turquesa-05/`,
  `${officialOrigin}/casas/casa-corais-milagres/`,
  `${officialOrigin}/contato/`,
];

describe("static SEO routes", () => {
  it("uses the official domain as the only canonical origin", () => {
    expect(siteConfig.url).toBe(officialOrigin);
  });

  it("generates every public and indexable URL in the sitemap", () => {
    const entries = sitemap();

    expect(entries.map((entry) => entry.url)).toEqual(expectedUrls);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(expectedUrls.length);
    entries.forEach((entry) => expect(entry.lastModified).toBeInstanceOf(Date));
  });

  it("allows crawling and publishes the sitemap address", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${officialOrigin}/sitemap.xml`,
    });
  });

  it("builds canonical and social URLs from the official origin", () => {
    const metadata = createMetadata({
      title: "Casa de teste",
      description: "Descricao de teste",
      path: "/casas/casa-turquesa-05/",
    });

    expect(metadata.alternates).toEqual({
      canonical: `${officialOrigin}/casas/casa-turquesa-05/`,
    });
    expect(metadata.title).toEqual({
      absolute: "Casa de teste | Casas Milagres",
    });
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Casa de teste | Casas Milagres",
      url: `${officialOrigin}/casas/casa-turquesa-05/`,
      images: [
        {
          url: `${officialOrigin}/images/og-image.jpg`,
          width: 3840,
          height: 2558,
        },
      ],
    });
  });

  it("keeps compatibility routes out of search indexes", () => {
    expect(createRedirectMetadata("/casas/")).toEqual({
      alternates: {
        canonical: `${officialOrigin}/casas/`,
      },
      robots: {
        index: false,
        follow: true,
      },
    });
  });
});
