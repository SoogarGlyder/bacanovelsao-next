import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';
import { stripHtml } from '@/utils/stringUtils';
import ChapterClient from './ChapterClient';
import { notFound } from 'next/navigation';
import Script from 'next/script'; // Tambahkan ini untuk JSON-LD

// --- BAGIAN SEO METADATA ---
export async function generateMetadata({ params }) {
  try {
    const { novelSlug, chapterSlug } = await params;
    await dbConnect();

    const novel = await Novel.findOne({ novel_slug: novelSlug })
      .select('title cover_image')
      .lean();
    
    if (!novel) {
      return { title: 'Novel Tidak Ditemukan' };
    }

    const chapter = await Chapter.findOne({ 
        novel: novel._id, 
        chapter_slug: chapterSlug 
    }).select('title content').lean();

    if (!chapter) {
      return { title: `Chapter Tidak Ditemukan | ${novel.title}` };
    }

    const rawContent = chapter.content || `Baca ${novel.title} ${chapter.title}`;
    const descPreview = stripHtml(rawContent).substring(0, 160);
    const ogImage = novel.cover_image || '/social-cover.jpg';
    const currentUrl = `/${novelSlug}/${chapterSlug}`; // URL saat ini

    return {
      title: `${chapter.title} | ${novel.title}`,
      description: descPreview,
      
      // 🔥 PENTING: Canonical URL untuk mencegah duplikat
      alternates: {
        canonical: currentUrl, 
      },
      // -----------------------------------------------

      openGraph: {
        title: `${chapter.title} | ${novel.title}`,
        description: descPreview,
        url: currentUrl,
        type: 'article', // Spesifik untuk bacaan
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

  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: 'linkstart.id',
      description: 'Baca Novel Sword Art Online Bahasa Indonesia Lengkap.',
    };
  }
}

// --- BAGIAN UTAMA HALAMAN ---
export default async function Page({ params }) {
  const { novelSlug, chapterSlug } = await params;
  
  await dbConnect();

  // 1. Ambil Data Novel
  const novel = await Novel.findOne({ novel_slug: novelSlug }).lean();
  if (!novel) notFound();

  // 2. Ambil Chapter Saat Ini & Update Views (+1)
  const currentChapter = await Chapter.findOneAndUpdate(
    { novel: novel._id, chapter_slug: chapterSlug },
    { $inc: { views: 1 } }, // Tambahkan views counter
    { new: true }
  ).lean();

  if (!currentChapter) notFound();

  // 3. Ambil Semua Chapter (Untuk Navigasi Prev/Next)
  const allChapters = await Chapter.find({ novel: novel._id })
    .select('title chapter_slug chapter_number')
    .sort({ chapter_number: 1 })
    .lean();

  // 4. Logika Navigasi (Prev/Next)
  const currentIndex = allChapters.findIndex(c => c.chapter_slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // ⚡️ OPTIMASI: Manual Serialization (Ganti JSON.parse/stringify)
  // Helper function kecil untuk serialize ID & Date
  const serialize = (obj) => {
    if (!obj) return null;
    return {
      ...obj,
      _id: obj._id.toString(),
      createdAt: obj.createdAt?.toISOString(),
      updatedAt: obj.updatedAt?.toISOString(),
      novel: obj.novel ? obj.novel.toString() : null, // Handle relasi ID novel jika ada
    };
  };

  const serializedNovel = serialize(novel);
  const serializedCurrentChapter = serialize(currentChapter);
  const serializedAllChapters = allChapters.map(c => ({
    ...c,
    _id: c._id.toString(), 
    // Kita tidak butuh date di list chapter, cukup ID
  }));
  const serializedPrev = serialize(prevChapter);
  const serializedNext = serialize(nextChapter);

  // 5. Schema Markup (Breadcrumbs) - Opsional tapi Bagus untuk SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://www.linkstart.id'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: novel.title,
        item: `https://www.linkstart.id/${novelSlug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentChapter.title,
        item: `https://www.linkstart.id/${novelSlug}/${chapterSlug}`
      }
    ]
  };

  return (
    <>
      {/* Masukkan Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ChapterClient 
        novel={serializedNovel}
        chapter={serializedCurrentChapter}
        allChapters={serializedAllChapters}
        prevChapter={serializedPrev}
        nextChapter={serializedNext}
      />
    </>
  );
}