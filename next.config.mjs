/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

export default nextConfig;