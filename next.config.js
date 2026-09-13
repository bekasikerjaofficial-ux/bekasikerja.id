/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using unoptimized images for static compatibility
  // All images served directly from /public
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
