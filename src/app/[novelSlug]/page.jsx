import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';
import { stripHtml } from '@/utils/stringUtils';
import NovelClient from './NovelClient';
import { notFound } from 'next/navigation';

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

  const cleanDescription = stripHtml(novel.synopsis || 'linkstart.id').substring(0, 160);
  const ogImage = novel.cover_image || '/social-cover.jpg';

  return {
    title: novel.title,
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

export default async function Page({ params }) {
  const { novelSlug } = await params;
  await dbConnect();

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

  const serializedNovel = JSON.parse(JSON.stringify(novel));
  const serializedChapters = JSON.parse(JSON.stringify(chapters));

  return <NovelClient initialNovel={serializedNovel} initialChapters={serializedChapters} />;
}