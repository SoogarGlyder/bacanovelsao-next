import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chapter from '@/models/Chapter';
import Novel from '@/models/Novel';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.novel || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap (Novel, Judul, Konten wajib)' },
        { status: 400 }
      );
    }

    const newChapter = await Chapter.create(body);

    await Novel.findByIdAndUpdate(body.novel, { 
      last_updated: new Date() 
    });

    return NextResponse.json({ success: true, data: newChapter }, { status: 201 });

  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Slug URL sudah digunakan, mohon ganti.' },
        { status: 400 }
      );
    }
    
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novel');

    let query = {};
    if (novelId) {
      query = { novel: novelId };
    }

    const chapters = await Chapter.find(query)
      .populate('novel', 'title')
      .sort({ chapter_number: 1 });

    return NextResponse.json(chapters, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}