import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowTime = 60 * 1000;
  
  if (rateLimitMap.has(ip)) {
    const lastRequestTime = rateLimitMap.get(ip);
    if (now - lastRequestTime < windowTime) {
      return true; 
    }
  }
  
  rateLimitMap.set(ip, now);
  return false;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterSlug = searchParams.get('chapterSlug');

    if (!chapterSlug) {
      return NextResponse.json({ success: false, error: 'Chapter Slug required' }, { status: 400 });
    }

    await dbConnect();

    const comments = await Comment.find({ chapterSlug })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Terlalu cepat! Mohon tunggu 1 menit sebelum berkomentar lagi.' }, 
        { status: 429 }
      );
    }

    const body = await request.json();
    const { novelSlug, chapterSlug, name, content } = body;

    if (!name || !content || !novelSlug || !chapterSlug) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap (Nama & Komentar wajib diisi)' }, 
        { status: 400 }
      );
    }

    await dbConnect();

    const newComment = await Comment.create({
      novelSlug,
      chapterSlug,
      name: name.trim(),
      content: content.trim()
    });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}