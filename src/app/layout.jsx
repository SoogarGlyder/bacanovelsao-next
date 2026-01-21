export const metadata = {
  metadataBase: new URL('https://linkstart.id'), 
  title: {
    template: '%s | linkstart.id',
    default: 'Beranda | linkstart.id',
  },
  description: 'Baca Novel Sword Art Online Bahasa Indonesia lengkap. Aincrad, Progressive, Gun Gale Online, dan lainnya.',
  applicationName: 'linkstart.id',
  keywords: ["novel sao", "sword art online", "aincrad", "progressive", "light novel", "baca online", "ggo", "novel fantasi"],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    apple: [
      { url: '/icon-512.png' },
    ],
    shortcut: ['/icon-512.png'],
  },
  openGraph: {
    title: 'linkstart.id',
    description: 'Baca Novel Seri Sword Art Online (SAO) lengkap Bahasa Indonesia.',
    url: 'https://linkstart.id',
    siteName: 'linkstart.id',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/social-cover.jpg',
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    "google-adsense-account": "ca-pub-4365395677457990"
  }, 
  verification: {
    google: 'evACUKravhwfZaodVDz4gMcDa3CiVHWpkKcDuh-3FC0',
  },
};