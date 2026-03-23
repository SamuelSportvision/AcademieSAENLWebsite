import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.12.115.35"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
