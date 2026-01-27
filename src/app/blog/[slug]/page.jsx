import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect'; 
import Article from '@/models/Article';   
import BlogClient from './BlogClient';    

// Fungsi helper untuk mengambil data
async function getArticle(slug) {
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

// --- SEO Metadata Dinamis ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: 'Artikel Tidak Ditemukan' };
  
  return {
    title: `${article.title} | Blog & Artikel`,
    description: article.excerpt,
    
    // --- TAMBAHAN CANONICAL SPESIFIK ---
    alternates: {
      canonical: `/blog/${slug}`, // Memaksa URL bersih tanpa query string
    },
    // -----------------------------------

    openGraph: {
      images: article.image ? [article.image] : [],
    },
  };
}

// --- Komponen Utama (Server Component) ---
export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Ambil data dari MongoDB
  const article = await getArticle(slug);

  // 2. Jika tidak ada, tampilkan 404
  if (!article) return notFound();

  // 3. Kirim data ke BlogClient (Layout Holy Grail)
  return <BlogClient article={article} />;
}