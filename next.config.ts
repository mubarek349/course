import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@heroui/react", "@heroui/theme", "@heroui/system"],
  experimental: {
    optimizePackageImports: ["@heroui/react"]
  },
  // Handle favicon and static files
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon',
      },
    ];
  },
  // Optimize build output
  output: 'standalone',
  // Skip favicon generation during build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
