import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export const revalidate = 3600; // Update sitemap setiap 1 jam (opsional)

export default async function sitemap() {
  const BASE_URL = 'https://bacanovelsao.vercel.app'; // URL Website Kamu

  await dbConnect();

  // 1. Ambil Semua Novel
  const novels = await Novel.find({}, 'novel_slug updatedAt').lean();

  // 2. Ambil Semua Chapter (Join dengan Novel untuk dapat slug novelnya)
  const chapters = await Chapter.find({}, 'chapter_slug updatedAt novel')
    .populate('novel', 'novel_slug')
    .lean();

  // 3. Buat Array URL untuk Novel
  const novelUrls = novels.map((novel) => ({
    url: `${BASE_URL}/${novel.novel_slug}`,
    lastModified: new Date(novel.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. Buat Array URL untuk Chapter
  const chapterUrls = chapters.map((chapter) => {
    // Pastikan novelnya ada (jaga-jaga kalau ada chapter yatim piatu)
    const novelSlug = chapter.novel?.novel_slug;
    if (!novelSlug) return null;

    return {
      url: `${BASE_URL}/${novelSlug}/${chapter.chapter_slug}`,
      lastModified: new Date(chapter.updatedAt),
      changeFrequency: 'monthly', // Chapter jarang berubah isinya
      priority: 0.6,
    };
  }).filter(Boolean); // Hapus yang null

  // 5. Gabungkan dengan Halaman Statis (Home)
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...novelUrls,
    ...chapterUrls,
  ];
}