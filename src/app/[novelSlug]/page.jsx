import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import { stripHtml } from '@/utils/stringUtils';
import NovelClient from './NovelClient';

// 1. FUNGSI GENERATE METADATA (Untuk SEO)
export async function generateMetadata({ params }) {
  // Await params (Wajib di Next.js 15)
  const { novelSlug } = await params;

  // Connect DB
  await dbConnect();

  // Ambil data novel (Hanya field yang dibutuhkan untuk SEO)
  const novel = await Novel.findOne({ novel_slug: novelSlug }).select('title synopsis cover_image');

  // Fallback jika novel tidak ditemukan
  if (!novel) {
    return {
      title: 'Novel Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak tersedia.',
    };
  }

  const cleanDescription = stripHtml(novel.synopsis || 'Baca Novel SAO Bahasa Indonesia');
  const ogImage = novel.cover_image || '/social-cover.jpg';

  return {
    title: novel.title, // Judul Tab Browser akan jadi: "Sword Art Online | Baca Novel SAO"
    description: cleanDescription,
    
    openGraph: {
      title: novel.title,
      description: cleanDescription,
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

// 2. KOMPONEN HALAMAN UTAMA
export default async function Page() {
  // Halaman server ini sangat sederhana.
  // Dia hanya bertugas render Metadata (di atas)
  // Lalu langsung menyerahkan urusan tampilan ke Client Component.
  
  return <NovelClient />;
}