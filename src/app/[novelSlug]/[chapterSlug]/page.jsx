import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';
import { stripHtml } from '@/utils/stringUtils';
import ChapterClient from './ChapterClient';

// 1. FUNGSI GENERATE METADATA (Server Side SEO)
export async function generateMetadata({ params }) {
  // Await params (Next.js 15)
  const { novelSlug, chapterSlug } = await params;

  // Connect DB
  await dbConnect();

  // Cari Novel dulu untuk dapat ID-nya
  const novel = await Novel.findOne({ novel_slug: novelSlug }).select('title cover_image');
  
  if (!novel) {
    return { title: 'Novel Tidak Ditemukan' };
  }

  // Cari Chapter spesifik
  const chapter = await Chapter.findOne({ 
      novel: novel._id, 
      chapter_slug: chapterSlug 
  }).select('title content');

  if (!chapter) {
    return { title: 'Chapter Tidak Ditemukan' };
  }

  // Bersihkan konten chapter untuk jadi Description di Google
  // Ambil 160 karakter pertama dari isi chapter
  const descPreview = stripHtml(chapter.content || `Baca ${novel.title} ${chapter.title}`);
  const ogImage = novel.cover_image || '/social-cover.jpg';

  return {
    // Format Judul: "Chapter 1 - Star King | Sword Art Online"
    title: `${chapter.title} | ${novel.title}`,
    description: descPreview,
    
    openGraph: {
      title: `${chapter.title} | ${novel.title}`,
      description: descPreview,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: `${novel.title} - ${chapter.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${chapter.title} | ${novel.title}`,
      description: descPreview,
      images: [ogImage],
    },
  };
}

// 2. KOMPONEN SERVER UTAMA
export default async function Page() {
  return <ChapterClient />;
}