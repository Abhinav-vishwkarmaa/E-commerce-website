import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "D:\Next js\my-next-app",
  }
  ,
  images: {
    domains: ["ilbmart-bucket.s3.ap-south-1.amazonaws.com"], // whitelist your S3 bucket
  }
};

export default nextConfig;
