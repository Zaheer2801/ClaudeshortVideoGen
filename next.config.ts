import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // an unrelated package-lock.json in the home directory (above this repo)
  // otherwise confuses Turbopack's workspace-root auto-detection
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
