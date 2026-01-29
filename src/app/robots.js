export default function robots() {
  // ⚠️ UBAH INI: Tambahkan www
  const baseUrl = 'https://www.linkstart.id';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
      ],
    },
    // Sitemap juga akan otomatis menunjuk ke versi www
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}