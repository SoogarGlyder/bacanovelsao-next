import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export async function GET(request, { params }) {
  const { novelSlug } = await params; 

  try {
    await dbConnect();

    const novel = await Novel.findOne({ novel_slug: novelSlug });

    if (!novel) {
      return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    const chapters = await Chapter.find({ novel: novel._id })
      .sort({ chapter_number: 1 })
      .select('title chapter_slug chapter_number');

    return NextResponse.json({
      novel,
      chapters
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { novelSlug } = await params;

  try {
    await dbConnect();
    const body = await request.json();

    const updatedNovel = await Novel.findOneAndUpdate(
        { novel_slug: novelSlug },
        { $set: body },
        { new: true }
    );

    if (!updatedNovel) {
      return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updatedNovel);

  } catch (error) {
    return NextResponse.json({ message: 'Gagal update novel', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { novelSlug } = await params;

  try {
    await dbConnect();

    const novel = await Novel.findOne({ novel_slug: novelSlug });
    if (!novel) {
       return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    await Novel.findByIdAndDelete(novel._id);
    
    await Chapter.deleteMany({ novel: novel._id });

    return NextResponse.json({ message: 'Novel dan semua chapternya berhasil dihapus' });

  } catch (error) {
    return NextResponse.json({ message: 'Gagal hapus novel', error: error.message }, { status: 500 });
  }
}