/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
};

export default nextConfig;