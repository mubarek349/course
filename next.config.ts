import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Increase as needed, e.g. "20mb"
    },
  },
};

// Note: This only affects /pages/api routes, not /app/api

export default nextConfig;
