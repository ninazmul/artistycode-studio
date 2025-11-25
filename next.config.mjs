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

    // Prevent accidental 4K image requests
    deviceSizes: [360, 640, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],

    // If dev keeps failing:
    // unoptimized: true,
  },

  distDir: ".next",
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // REMOVE the _next/image caching — Next handles it itself

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
