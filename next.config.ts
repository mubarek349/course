import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@heroui/react", "@heroui/theme", "@heroui/system"],
  experimental: {
    optimizePackageImports: ["@heroui/react"]
  }
};

export default nextConfig;
