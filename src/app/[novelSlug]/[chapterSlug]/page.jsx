import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';
import { stripHtml } from '@/utils/stringUtils';
import ChapterClient from './ChapterClient';
import { notFound } from 'next/navigation';

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

    return {
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

  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: 'linkstart.id',
      description: 'Baca Novel Sword Art Online Bahasa Indonesia Lengkap.',
    };
  }
}

export default async function Page({ params }) {
  const { novelSlug, chapterSlug } = await params;
  
  await dbConnect();

  const novel = await Novel.findOne({ novel_slug: novelSlug }).lean();
  if (!novel) notFound();

  const currentChapter = await Chapter.findOne({ 
    novel: novel._id, 
    chapter_slug: chapterSlug 
  }).lean();

  if (!currentChapter) notFound();

  const allChapters = await Chapter.find({ novel: novel._id })
    .select('title chapter_slug chapter_number')
    .sort({ chapter_number: 1 })
    .lean();

  const currentIndex = allChapters.findIndex(c => c.chapter_slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  const serializedNovel = JSON.parse(JSON.stringify(novel));
  const serializedCurrentChapter = JSON.parse(JSON.stringify(currentChapter));
  const serializedAllChapters = JSON.parse(JSON.stringify(allChapters));
  const serializedPrev = prevChapter ? JSON.parse(JSON.stringify(prevChapter)) : null;
  const serializedNext = nextChapter ? JSON.parse(JSON.stringify(nextChapter)) : null;

  return (
    <>
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