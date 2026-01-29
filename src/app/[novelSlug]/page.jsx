import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';
import { stripHtml } from '@/utils/stringUtils';
import NovelClient from './NovelClient';
import { notFound } from 'next/navigation';

// --- BAGIAN SEO METADATA ---
export async function generateMetadata({ params }) {
  const { novelSlug } = await params;
  await dbConnect();
  
  const novel = await Novel.findOne({ novel_slug: novelSlug })
    .select('title synopsis cover_image')
    .lean();

  if (!novel) {
    return {
      title: 'Novel Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak tersedia.',
    };
  }

  // Fallback deskripsi yang lebih baik untuk SEO
  const rawDesc = novel.synopsis || `Baca novel ${novel.title} Bahasa Indonesia di LinkStart ID.`;
  const cleanDescription = stripHtml(rawDesc).substring(0, 160);
  const ogImage = novel.cover_image || '/social-cover.jpg';

  return {
    title: novel.title,
    description: cleanDescription,
    
    // 🔥 WAJIB: Canonical URL untuk mencegah Duplikat Content
    alternates: {
      canonical: `/${novelSlug}`, 
    },
    // -----------------------------------------------------

    openGraph: {
      title: novel.title,
      description: cleanDescription,
      url: `/${novelSlug}`, // Tambahkan URL eksplisit
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: novel.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: novel.title,
      description: cleanDescription,
      images: [ogImage],
    },
  };
}

// --- BAGIAN HALAMAN UTAMA ---
export default async function Page({ params }) {
  const { novelSlug } = await params;
  await dbConnect();

  // Update views dan ambil data sekaligus
  const novel = await Novel.findOneAndUpdate(
    { novel_slug: novelSlug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!novel) {
    notFound();
  }

  const chapters = await Chapter.find({ novel: novel._id })
    .select('title chapter_slug chapter_number') 
    .sort({ chapter_number: 1 }) 
    .lean();

  // ⚡️ OPTIMASI: Cara "Membersihkan" data MongoDB tanpa JSON.parse/stringify (Lebih Cepat)
  const serializedNovel = {
    ...novel,
    _id: novel._id.toString(),
    createdAt: novel.createdAt?.toISOString(),
    updatedAt: novel.updatedAt?.toISOString(),
    // Pastikan field tanggal lain juga di-convert jika ada
  };

  const serializedChapters = chapters.map(chapter => ({
    ...chapter,
    _id: chapter._id.toString(),
    // Jika di chapter ada tanggal, convert juga di sini
  }));

  return <NovelClient initialNovel={serializedNovel} initialChapters={serializedChapters} />;
}