import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // maplibre-gl ships ESM that needs transpiling in the server bundle
    optimizePackageImports: ["maplibre-gl"],
  },
};

export default nextConfig;
