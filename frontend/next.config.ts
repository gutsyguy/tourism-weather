import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack configuration for Leaflet
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
