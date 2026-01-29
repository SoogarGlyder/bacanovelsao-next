import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect'; 
import Article from '@/models/Article';   
import BlogClient from './BlogClient';    
import Script from 'next/script';

// Fungsi helper (digunakan di Metadata)
async function getArticleData(slug) {
  await dbConnect();
  const article = await Article.findOne({ slug }).lean();
  
  if (!article) return null;

  return {
    ...article,
    _id: article._id.toString(),
    createdAt: article.createdAt?.toISOString(),
    updatedAt: article.updatedAt?.toISOString(),
  };
}

// --- SEO Metadata Dinamis (Diperlengkap) ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleData(slug);

  if (!article) return { title: 'Artikel Tidak Ditemukan' };

  // Fallback image jika artikel tidak punya gambar
  const ogImage = article.image || '/social-cover.jpg';
  
  return {
    title: article.title,
    description: article.excerpt,
    
    // Canonical URL (Sudah Benar)
    alternates: {
      canonical: `/blog/${slug}`,
    },

    // Open Graph (Untuk Facebook, WhatsApp, LinkedIn)
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/blog/${slug}`,
      siteName: 'Link Start ID',
      locale: 'id_ID',
      type: 'article', // Memberitahu ini adalah artikel
      publishedTime: article.createdAt,
      authors: ['Link Start ID'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },

    // Twitter Card (Wajib agar gambar besar di Twitter/X)
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

// --- Komponen Utama ---
export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Logic Hitung Views & Ambil Data (Seperti di Novel Page)
  await dbConnect();
  
  // Menggunakan findOneAndUpdate agar Views bertambah setiap kali dibuka
  // Jika tidak ingin menghitung views, ganti jadi findOne() biasa
  const articleRaw = await Article.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } }, // Increment views +1
    { new: true } 
  ).lean();

  if (!articleRaw) return notFound();

  // 2. Serialisasi Data Manual (Ringan)
  const article = {
    ...articleRaw,
    _id: articleRaw._id.toString(),
    createdAt: articleRaw.createdAt?.toISOString(),
    updatedAt: articleRaw.updatedAt?.toISOString(),
  };

  // 3. Siapkan JSON-LD (Schema Markup untuk Google)
  // Ini membuat artikel Anda dimengerti Google sebagai "NewsArticle" atau "BlogPosting"
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [article.image] : ['https://www.linkstart.id/social-cover.jpg'],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Link Start ID',
      url: 'https://www.linkstart.id'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Link Start ID',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.linkstart.id/icon-512.png'
      }
    }
  };

  return (
    <>
      {/* Masukkan JSON-LD ke dalam head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Render Halaman */}
      <BlogClient article={article} />
    </>
  );
}