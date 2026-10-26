import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next start` refuses to run when output is "standalone", and Liara's
  // NextJS platform starts the app with `npm start`. Docker builds still need
  // standalone, so it is opt-in via BUILD_STANDALONE=1 (set in the Dockerfile).
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
