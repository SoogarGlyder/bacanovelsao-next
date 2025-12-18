import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';

export async function GET(request) {
  try {
    await dbConnect();

    // Ambil query param (?serie=...)
    const { searchParams } = new URL(request.url);
    const serie = searchParams.get('serie');

    let query = {};
    if (serie) {
        query.serie = serie;
    }

    // Logic: Ambil field tertentu saja, urutkan dari terlama (createdAt: 1)
    // Sesuai logic lama: packages/server/routes/novels.js
    const novels = await Novel.find(query, 'title serie novel_slug cover_image')
                              .sort({ createdAt: 1 });

    return NextResponse.json(novels);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching novels' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Ambil data dari body request
    const body = await request.json();
    const { title, serie, synopsis, cover_image, novel_slug } = body;

    // 2. Validasi sederhana
    if (!title || !novel_slug) {
       return NextResponse.json(
         { message: 'Judul dan Slug wajib diisi!' }, 
         { status: 400 }
       );
    }

    // 3. Cek apakah slug sudah terpakai?
    const existingNovel = await Novel.findOne({ novel_slug });
    if (existingNovel) {
        return NextResponse.json(
            { message: 'Slug novel ini sudah ada. Ganti slug lain.' }, 
            { status: 400 }
        );
    }

    // 4. Simpan ke Database
    const newNovel = new Novel({
      title,
      serie,
      synopsis,
      cover_image,
      novel_slug
    });

    const savedNovel = await newNovel.save();

    return NextResponse.json(savedNovel, { status: 201 });

  } catch (error) {
    console.error('Error creating novel:', error);
    return NextResponse.json(
      { message: 'Gagal membuat novel', error: error.message },
      { status: 500 }
    );
  }
}