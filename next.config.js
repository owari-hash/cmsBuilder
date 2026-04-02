/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["cms-builder"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  }
};

module.exports = nextConfig;
