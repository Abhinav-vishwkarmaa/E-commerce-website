import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // enable Turbopack with default settings
  images: {
    domains: ["ilbmart-bucket.s3.ap-south-1.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // prevents ESLint errors from failing build
  },
};

export default nextConfig;
