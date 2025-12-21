import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

const BASE_URL = 'https://bacanovelsao.vercel.app';

export default async function sitemap() {
  await dbConnect();

  const novels = await Novel.find({})
    .select('novel_slug updatedAt')
    .lean();

  const chapters = await Chapter.find({})
    .select('chapter_slug updatedAt novel')
    .populate({
      path: 'novel',
      select: 'novel_slug',
    })
    .sort({ updatedAt: -1 })
    .lean();

  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const novelRoutes = novels.map((novel) => ({
    url: `${BASE_URL}/${novel.novel_slug}`,
    lastModified: novel.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const chapterRoutes = chapters.map((chapter) => {
    const novelSlug = chapter.novel?.novel_slug; 
    
    if (!novelSlug) return null;

    return {
      url: `${BASE_URL}/${novelSlug}/${chapter.chapter_slug}`,
      lastModified: chapter.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  }).filter(Boolean);

  return [...routes, ...novelRoutes, ...chapterRoutes];
}