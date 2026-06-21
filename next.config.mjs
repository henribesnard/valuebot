/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${process.env.INTERNAL_API_URL || "http://localhost:8000"}/api/:path*`,
    },
  ],
};

export default nextConfig;
