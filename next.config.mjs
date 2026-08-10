/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "react-icons",
      "recharts",
    ],
  },

  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [360, 640, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      // Allow all external HTTPS domains for blog article images from News API
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  distDir: ".next",
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      // ✅ Remove custom caching for _next/static to avoid warnings
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
