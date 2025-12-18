import './globals.css';
import Script from 'next/script'; // Untuk AdSense
import { GoogleAnalytics } from '@next/third-parties/google'; // Untuk GA4
import { GlobalProvider } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 1. DATA JSON-LD (Dari index.html lama)
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

// 2. VIEWPORT (BARU: Rumah baru untuk themeColor)
export const viewport = {
  themeColor: '#38b6ff',
  width: 'device-width',
  initialScale: 1,
};

// 3. METADATA (Pengganti tag <meta> dan <link> di index.html)
export const metadata = {
  // Pengganti CanonicalLink.jsx: Ini base URL untuk semua link canonical
  metadataBase: new URL('https://bacanovelsao.vercel.app'), 

  title: {
    template: '%s | Baca Novel SAO',
    default: 'Baca Novel SAO - Sword Art Online Bahasa Indonesia',
  },
  description: 'Baca Novel Sword Art Online Bahasa Indonesia lengkap. Aincrad, Progressive, Gun Gale Online, dan lainnya.',
  
  // Pengganti keywords di SEO.jsx
  keywords: ["novel sao", "sword art online", "aincrad", "progressive", "light novel", "baca online", "ggo", "novel fantasi"],
  
  manifest: '/manifest.json',
  // themeColor: '#38b6ff', <--- SUDAH DIHAPUS DARI SINI (Pindah ke viewport di atas)
  
  icons: {
    icon: '/favicon.png',
    apple: '/icon-512.png',
  },
  
  // OpenGraph Default
  openGraph: {
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
  
  // Twitter Card Default
  twitter: {
    card: 'summary_large_image',
  },

  // verification: {
  //   google: 'KODE_VERIFIKASI_GOOGLE_KAMU_DISINI',
  // },

  other: {
    "google-adsense-account": "ca-pub-4365395677457990"
  }  
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Inject JSON-LD untuk SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Script AdSense (Async) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4365395677457990"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <GlobalProvider>
          {/* Header dipanggil di sini */}
          <Header /> 

          <main style={{ 
            marginTop: 'var(--total-header-height, 60px)',
            minHeight: 'calc(100vh - var(--total-header-height, 60px))' 
          }}>
            {children}
          </main>

          {/* Footer dipanggil di sini */}
          <Footer />
        </GlobalProvider>

        {/* Google Analytics 4 (Otomatis track pageview) */}
        <GoogleAnalytics gaId="G-3Y3LMERW26" />
      </body>
    </html>
  );
}