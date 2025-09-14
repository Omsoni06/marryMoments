/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "dkxqsxd9h.cloudinary.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["qrcode"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
