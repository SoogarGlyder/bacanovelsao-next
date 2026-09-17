import './globals.css';
import Script from 'next/script'; 
import { GoogleAnalytics } from '@next/third-parties/google'; 
import { SpeedInsights } from "@vercel/speed-insights/next"; 
import { Analytics } from "@vercel/analytics/next"; 
import { Providers } from './providers'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSettings from '@/components/FloatingSettings';
import fs from 'fs';
import path from 'path';

function getAdSettings() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ads-config.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileData);
    }
  } catch (e) {
    // Abaikan error, gunakan nilai default
  }
  // 🔥 Update default fallback agar mencakup ke-4 jenis iklan
  return { sociobar: true, popunder: true, nativeBanner: true, smartlink: true };
}

export const viewport = {
  themeColor: '#38b6ff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://www.linkstart.id'),
  alternates: {
    canonical: '/',
  },
  title: 'linkstart.id | Baca Novel Sword Art Online Bahasa Indonesia', 
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
  const ads = getAdSettings(); 

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
        
        {/* Iklan Global */}
        {ads.sociobar && (
          <Script
            src="https://pl31370948.profitableratecpmnetwork.com/7f/70/c5/7f70c5c98dd19c922e7a96222343bab6.js"
            strategy="lazyOnload"
          />
        )}

        {ads.popunder && (
          <Script
            src="https://pl31370947.profitableratecpmnetwork.com/ca/d9/dc/cad9dc4502022243eb3b66190bc09cae.js"
            strategy="lazyOnload"
          />
        )}
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
        
        <SpeedInsights />
        <Analytics /> 
        <GoogleAnalytics gaId="G-3Y3LMERW26" />
      </body>
    </html>
  );
}