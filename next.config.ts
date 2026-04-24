import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev server to work with local network IP addresses and localhost
  // In Next 16, allowedDevOrigins is a top-level option
  allowedDevOrigins: [
    "10.25.2.131",
    "localhost",
  ],
  typescript: {
    // Next build sometimes hangs on built-in typecheck with Turbopack
    // TypeScript is checked separately with `npx tsc --noEmit`
    ignoreBuildErrors: true,
  },
  images: {
    // Allow images to be served from local network IP
    remotePatterns: [
      {
        hostname: "10.25.2.131",
      },
      {
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
