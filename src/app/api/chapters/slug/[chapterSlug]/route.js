import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export async function GET(request, { params }) {
  const { chapterSlug } = await params;
  const { searchParams } = new URL(request.url);
  const novelSlug = searchParams.get('novelSlug');

  try {
    await dbConnect();

    const novelInfo = await Novel.findOne({ novel_slug: novelSlug }, '_id').lean();

    if (!novelInfo) {
      return NextResponse.json(
        { message: 'Novel tidak ditemukan berdasarkan slug' }, 
        { status: 404 }
      );
    }

    const [chapter, allChaptersList] = await Promise.all([
        Chapter.findOne({ 
            novel: novelInfo._id, 
            chapter_slug: chapterSlug 
        })
        .populate('novel', 'title serie novel_slug')
        .lean(),
        
        Chapter.find({ novel: novelInfo._id }, 'title chapter_slug chapter_number')
               .sort({ chapter_number: 1 })
               .lean()
    ]);

    if (!chapter) {
        return NextResponse.json({ message: 'Chapter tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
        chapterDetail: chapter, 
        allChapters: allChaptersList 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}