import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export async function GET(request, { params }) {
  const { chapterSlug } = await params;
  
  // Ambil novelSlug dari Query Param (?novelSlug=xxx)
  const { searchParams } = new URL(request.url);
  const novelSlug = searchParams.get('novelSlug');

  try {
    await dbConnect();

    // 1. Cari Info Novel dulu untuk dapatkan ID-nya (Validasi)
    const novelInfo = await Novel.findOne({ novel_slug: novelSlug }, '_id').lean();

    if (!novelInfo) {
      return NextResponse.json(
        { message: 'Novel tidak ditemukan berdasarkan slug' }, 
        { status: 404 }
      );
    }

    // 2. Jalankan 2 Query sekaligus (Paralel) agar cepat:
    //    A. Ambil Detail Chapter yang sedang dibaca (termasuk content)
    //    B. Ambil Daftar Semua Chapter (untuk sidebar navigasi)
    const [chapter, allChaptersList] = await Promise.all([
        Chapter.findOne({ 
            novel: novelInfo._id, 
            chapter_slug: chapterSlug 
        })
        .populate('novel', 'title serie novel_slug') // Join ke tabel novel
        .lean(),
        
        Chapter.find({ novel: novelInfo._id }, 'title chapter_slug chapter_number')
               .sort({ chapter_number: 1 })
               .lean()
    ]);

    if (!chapter) {
        return NextResponse.json({ message: 'Chapter tidak ditemukan' }, { status: 404 });
    }

    // 3. Kirim hasil gabungan
    return NextResponse.json({ 
        chapterDetail: chapter, 
        allChapters: allChaptersList 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}