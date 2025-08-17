import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove the experimental suppressHydrationWarning as it's not a valid Next.js config
  // We're using suppressHydrationWarning directly on components instead
};

export default nextConfig;
