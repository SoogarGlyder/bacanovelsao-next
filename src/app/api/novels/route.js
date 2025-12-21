import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const serie = searchParams.get('serie');

    let query = {};
    if (serie) {
        query.serie = serie;
    }

    const novels = await Novel.find(query)
                              .sort({ title: 1 });

    return NextResponse.json(novels, { status: 200 });

  } catch (error) {
    console.error("Error fetching novels:", error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data novel' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, novel_slug } = body;

    if (!title || !novel_slug) {
       return NextResponse.json(
         { success: false, error: 'Judul dan Slug wajib diisi!' }, 
         { status: 400 }
       );
    }

    const newNovelData = {
      ...body,
      last_updated: new Date() 
    };

    const newNovel = await Novel.create(newNovelData);

    return NextResponse.json({ success: true, data: newNovel }, { status: 201 });

  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Slug URL ini sudah dipakai novel lain. Mohon ganti.' },
        { status: 400 }
      );
    }

    console.error('Error creating novel:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}