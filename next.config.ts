import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Ensure WHO/IAP LMS JSON ships with serverless/standalone output
  // so chart centile curves and Z-scores can load from disk.
  outputFileTracingIncludes: {
    "/**": ["./data/growth-references/**/*"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
