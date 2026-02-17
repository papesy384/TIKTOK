import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  // Optimize for low-latency streaming (Cloudinary/Mux)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.mux.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
