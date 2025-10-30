import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // enable Turbopack with default settings
images: {
  domains: ["cdn.grofers.com", "cdn.ilbmart.com"],
  formats: ["image/avif", "image/webp"], // better compression
},

  eslint: {
    ignoreDuringBuilds: true, // prevents ESLint errors from failing build
  },
};

export default nextConfig;
