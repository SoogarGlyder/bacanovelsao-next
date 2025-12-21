import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chapter from '@/models/Chapter';
import Novel from '@/models/Novel';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    await dbConnect();

    const body = await request.json();

    const updatedChapter = await Chapter.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedChapter) {
      return NextResponse.json(
        { success: false, error: 'Chapter tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedChapter }, { status: 200 });

  } catch (error) {
    console.error('Error updating chapter:', error);
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

    const deletedChapter = await Chapter.findByIdAndDelete(id);

    if (!deletedChapter) {
      return NextResponse.json(
        { success: false, error: 'Chapter tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });

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
  
      const chapter = await Chapter.findById(id).populate('novel', 'title');
  
      if (!chapter) {
        return NextResponse.json(
          { success: false, error: 'Chapter tidak ditemukan' },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ success: true, data: chapter }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }