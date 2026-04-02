/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cms-builder/core"],
  experimental: {
    // serverActions is now an object or enabled by default in newer Next.js
  }
};

export default nextConfig;
