import './globals.css';
import Script from 'next/script'; 
import { GoogleAnalytics } from '@next/third-parties/google'; 
import { Providers } from './providers'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSettings from '@/components/FloatingSettings';

export const viewport = {
  themeColor: '#38b6ff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://linkstart.id'), 
  
  alternates: {
    canonical: './',
  },

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

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'linkstart.id',
    alternateName: ['BacaNovelSAO', 'Novel SAO', 'SAO Reader'], 
    url: 'https://linkstart.id',
    potentialAction: {
      "@type": "SearchAction",
      "target": "https://linkstart.id/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4365395677457990"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Header /> 
          <main style={{ 
            marginTop: '0', 
            minHeight: 'calc(100vh - var(--total-header-height))',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}>
            {children}
          </main>
          <Footer />
          <FloatingSettings />
        </Providers>
        <GoogleAnalytics gaId="G-3Y3LMERW26" />
      </body>
    </html>
  );
}