import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script'; // Import Script untuk JSON-LD
import styles from './Blog.module.css';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

// Tetap gunakan force-dynamic agar artikel baru langsung muncul
export const dynamic = 'force-dynamic'; 

// --- 1. METADATA SEO LENGKAP ---
export const metadata = {
  title: 'Blog & Artikel',
  description: 'Update terbaru, panduan, dan pembahasan mendalam dunia Sword Art Online.',
  
  // 🔥 WAJIB: Canonical URL agar tidak duplicate content
  alternates: {
    canonical: '/blog', 
  },
  // -----------------------------------------------------

  openGraph: {
    title: 'Blog & Artikel | Link Start ID',
    description: 'Update terbaru, panduan, dan pembahasan mendalam dunia Sword Art Online.',
    url: '/blog',
    siteName: 'Link Start ID',
    locale: 'id_ID',
    type: 'website', // Tipe 'website' cocok untuk halaman index/list
    images: [
      {
        url: '/social-cover.jpg', // Pastikan gambar ini ada di public
        width: 1200,
        height: 630,
        alt: 'Blog Link Start ID',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Artikel | Link Start ID',
    description: 'Update terbaru, panduan, dan pembahasan mendalam dunia Sword Art Online.',
    images: ['/social-cover.jpg'],
  },
};

async function getArticles() {
  await dbConnect();
  const articles = await Article.find({})
    .select('title slug date image tags excerpt createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();
  
  // Serialisasi data agar aman dikirim ke Client Component (jika perlu)
  return articles.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  }));
}

export default async function ArticleListPage() {
  const articles = await getArticles();

  // --- 2. JSON-LD SCHEMA (CollectionPage) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog & Artikel Link Start ID',
    description: 'Kumpulan artikel dan berita terbaru seputar Sword Art Online.',
    url: 'https://www.linkstart.id/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.linkstart.id/blog/${article.slug}`,
        name: article.title
      }))
    }
  };

  return (
    <div className={styles.container}>
      {/* Inject JSON-LD */}
      <Script
        id="json-ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Artikel & Berita</h1>
        <p className={styles.pageSubtitle}>
          Update terbaru, panduan, dan pembahasan mendalam dunia Sword Art Online.
        </p>
      </div>

      {/* Cek jika belum ada artikel */}
      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
          <p>Belum ada artikel yang diterbitkan.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {articles.map((article) => {
            // Logic fallback image yang lebih aman
            const displayImage = article.image || '/social-cover.jpg'; 
            
            return (
              <Link href={`/blog/${article.slug}`} key={article._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={displayImage} 
                    alt={article.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }} 
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span className={styles.date}>{article.date}</span>
                    <span className={styles.tag}>
                      {Array.isArray(article.tags) && article.tags.length > 0 ? article.tags[0] : 'Umum'}
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  <span className={styles.readMore}>Baca Selengkapnya &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}