import type { NextConfig } from "next";

const workerUrl = process.env.WORKER_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${workerUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
