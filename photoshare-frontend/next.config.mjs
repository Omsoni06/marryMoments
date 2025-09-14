/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "dkxqsxd9h.cloudinary.com"],
    unoptimized: true,
  },
  serverExternalPackages: ["qrcode"], // Updated from experimental.serverComponentsExternalPackages
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
