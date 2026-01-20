/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],

  images: {
    // --- TAMBAHKAN BARIS INI ---
    unoptimized: true, 
    // Artinya: "Next.js, tolong jangan coba-coba resize gambar, tampilkan apa adanya."
    // ---------------------------

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