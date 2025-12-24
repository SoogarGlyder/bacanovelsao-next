import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const body = await request.json();

    const updatedNovel = await Novel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNovel) {
      return NextResponse.json(
        { success: false, error: 'Novel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedNovel }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedNovel = await Novel.findByIdAndDelete(id);

    if (!deletedNovel) {
      return NextResponse.json(
        { success: false, error: 'Novel tidak ditemukan' },
        { status: 404 }
      );
    }

    await Chapter.deleteMany({ novel: id });

    return NextResponse.json(
      { success: true, message: 'Novel dan semua chapternya berhasil dihapus' }, 
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const novel = await Novel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, 
      { new: true } 
    );

    if (!novel) {
      return NextResponse.json(
        { success: false, error: 'Novel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: novel }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}