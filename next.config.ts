import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.youtube.com"], // Tambahkan domain ini
  },
  transpilePackages: ["recharts"],
};

export default nextConfig;
