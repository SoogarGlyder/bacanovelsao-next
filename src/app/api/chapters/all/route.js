import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Chapter from '@/models/Chapter';
import Novel from '@/models/Novel';

export async function GET() {
  try {
    await dbConnect();
    const chapters = await Chapter.find({})
      .populate('novel', 'title') 
      .sort({ createdAt: -1 });
      
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Error API Chapters:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}