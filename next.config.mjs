/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // Izinkan Postimages
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',  // Jaga-jaga
      },
    ],
  },
};

export default nextConfig;