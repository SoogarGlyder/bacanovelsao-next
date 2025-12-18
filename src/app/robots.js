export default function robots() {
  const BASE_URL = 'https://bacanovelsao.vercel.app';

  return {
    rules: {
      userAgent: '*',     // Berlaku untuk semua bot (Google, Bing, dll)
      allow: '/',         // Izinkan akses ke semua halaman
      disallow: '/api/',  // JANGAN index halaman API (karena isinya cuma JSON)
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}