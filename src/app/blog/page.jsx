import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Blog.module.css';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

export const metadata = {
  title: 'Blog & Artikel | Link Start ID',
  description: 'Update terbaru dunia Sword Art Online.',
};

// Fungsi ambil semua data artikel
async function getArticles() {
  await dbConnect();
  // Mengambil field yang diperlukan saja agar lebih ringan
  const articles = await Article.find({})
    .select('title slug date image tags excerpt createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();
  
  return articles.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  }));
}

export default async function ArticleListPage() {
  const articles = await getArticles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Artikel & Berita</h1>
        <p className={styles.pageSubtitle}>
          Update terbaru, panduan, dan pembahasan mendalam dunia Sword Art Online.
        </p>
      </div>

      <div className={styles.grid}>
        {articles.map((article) => {
          // LOGIKA BARU: Jika image kosong, pakai no-image.jpg
          const displayImage = article.image || '/images/no-image.jpg';

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
                  {/* Cek apakah tags ada isinya agar tidak error */}
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
    </div>
  );
}