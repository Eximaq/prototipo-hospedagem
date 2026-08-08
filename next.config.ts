import type { NextConfig } from "next";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/+$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(configuredBasePath
    ? {
        basePath: configuredBasePath,
        assetPrefix: configuredBasePath,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
