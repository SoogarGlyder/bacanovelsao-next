/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengizinkan domain gambar jika nanti pakai <Image /> dari eksternal
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Bisa dipersempit nanti demi keamanan
      },
    ],
  },
};

export default nextConfig;