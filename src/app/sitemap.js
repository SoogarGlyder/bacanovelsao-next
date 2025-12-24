import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

const BASE_URL = 'https://bacanovelsao.vercel.app';

export default async function sitemap() {
  await dbConnect();

  const [novels, chapters] = await Promise.all([
    Novel.find({})
      .select('novel_slug updatedAt last_updated')
      .lean(),
      
    Chapter.find({})
      .select('chapter_slug updatedAt novel')
      .populate({
        path: 'novel',
        select: 'novel_slug',
      })
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean()
  ]);

  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  const novelRoutes = novels.map((novel) => ({
    url: `${BASE_URL}/${novel.novel_slug}`,
    lastModified: novel.last_updated || novel.updatedAt || new Date(),
    changeFrequency: 'daily', 
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