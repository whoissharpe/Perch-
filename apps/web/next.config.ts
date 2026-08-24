import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @perch/core ships TypeScript source rather than a build step, so Next has
  // to compile it alongside the app.
  transpilePackages: ["@perch/core"],
  experimental: {
    optimizePackageImports: ["maplibre-gl"],
  },
};

export default nextConfig;
