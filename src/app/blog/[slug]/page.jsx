import React from 'react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect'; // Menggunakan file yang Anda kirim
import Article from '@/models/Article';   // Model yang baru dibuat
import BlogClient from './BlogClient';    // Layout Holy Grail yang sudah ada

// Fungsi helper untuk mengambil data (agar kode lebih rapi)
async function getArticle(slug) {
  await dbConnect();
  // lean() mengubah dokumen Mongoose menjadi objek JavaScript biasa (lebih ringan)
  const article = await Article.findOne({ slug }).lean();
  
  if (!article) return null;

  // Serialisasi data (ubah ObjectId dan Date jadi string agar Next.js tidak error)
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
    title: `${article.title} | Link Start ID`,
    description: article.excerpt,
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