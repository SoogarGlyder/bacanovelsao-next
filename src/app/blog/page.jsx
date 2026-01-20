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
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  
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
        {articles.map((article) => (
          <Link href={`/blog/${article.slug}`} key={article._id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {article.image ? (
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              ) : (
                <div className={styles.placeholderImage} />
              )}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.meta}>
                <span className={styles.date}>{article.date}</span>
                <span className={styles.tag}>{article.tags[0]}</span>
              </div>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.cardExcerpt}>{article.excerpt}</p>
              <span className={styles.readMore}>Baca Selengkapnya &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}