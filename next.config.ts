import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      // Wildcard path matching
      // {
      //   source: "/blog/:slug",
      //   destination: "/news/:slug",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
