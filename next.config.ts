import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Нужно для работы dev-сервера при открытии не с localhost (LAN / IP).
  // В Next 16 это опция верхнего уровня (НЕ experimental).
  allowedDevOrigins: [
    "http://10.25.2.131:3000",
    "http://localhost:3000",
    "10.25.2.131",
    "localhost:3000",
  ],
  typescript: {
    // Next build иногда подвисает на встроенном typecheck в окружениях с Turbopack.
    // TypeScript проверяется отдельно командой `npx tsc --noEmit`.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "10.25.2.131",
      },
    ],
  },
};

export default nextConfig;
