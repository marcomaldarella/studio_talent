import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/mark-fisher-screening',
        destination: '/press/mark-fisher-screening',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
