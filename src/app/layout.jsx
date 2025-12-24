import './globals.css';
import Script from 'next/script'; 
import { GoogleAnalytics } from '@next/third-parties/google'; 
import { Providers } from './providers'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSettings from '@/components/FloatingSettings';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Baca Novel SAO",
  "alternateName": ["BacaNovelSAO"],
  "url": "https://bacanovelsao.vercel.app/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://bacanovelsao.vercel.app/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const viewport = {
  themeColor: '#38b6ff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://bacanovelsao.vercel.app'), 
  title: {
    template: '%s | Baca Novel SAO',
    default: 'Beranda | Baca Novel SAO',
  },
  description: 'Baca Novel Sword Art Online Bahasa Indonesia lengkap. Aincrad, Progressive, Gun Gale Online, dan lainnya.',
  applicationName: 'Baca Novel SAO',
  keywords: ["novel sao", "sword art online", "aincrad", "progressive", "light novel", "baca online", "ggo", "novel fantasi"],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-512.png',
  },
  openGraph: {
    title: 'Baca Novel SAO',
    description: 'Baca Novel Seri Sword Art Online (SAO) lengkap Bahasa Indonesia.',
    url: 'https://bacanovelsao.vercel.app',
    siteName: 'Baca Novel SAO',
    locale: 'id_ID',
    type: 'website',
    siteName: 'Baca Novel SAO',
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
    google: 'nhiEmkP869Z5j_Sm6ArCX-QUlFNlEl-tHBl2aP5kQHk',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Baca Novel SAO',
    alternateName: ['Novel SAO', 'SAO Reader'],
    url: 'https://bacanovelsao.vercel.app',
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
            marginTop: 'var(--total-header-height)', 
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