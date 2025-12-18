import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Novel from '@/models/Novel';
import Chapter from '@/models/Chapter';

export async function GET(request, { params }) {
  // FIX: Di Next.js terbaru, params harus di-await!
  const { novelSlug } = await params; 

  try {
    await dbConnect();

    // 1. Cari Novelnya
    const novel = await Novel.findOne({ novel_slug: novelSlug });

    if (!novel) {
      return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    // 2. Cari Chapter berdasarkan ID novel tersebut
    const chapters = await Chapter.find({ novel: novel._id })
      .sort({ chapter_number: 1 })
      .select('title chapter_slug chapter_number');

    // 3. Gabungkan respon
    return NextResponse.json({
      novel,
      chapters
    });

  } catch (error) {
    console.error("Database Error:", error); // Cek terminal untuk detail error ini
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}

// ... (Import dan fungsi GET biarkan di atas) ...

// 1. UPDATE NOVEL (PUT)
export async function PUT(request, { params }) {
  const { novelSlug } = await params; // Ingat await params!

  try {
    await dbConnect();
    const body = await request.json();

    // Cari berdasarkan slug lama, lalu update isinya
    const updatedNovel = await Novel.findOneAndUpdate(
        { novel_slug: novelSlug },
        { $set: body }, // Update field yang dikirim saja
        { new: true }   // Kembalikan data yang sudah baru
    );

    if (!updatedNovel) {
      return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updatedNovel);

  } catch (error) {
    return NextResponse.json({ message: 'Gagal update novel', error: error.message }, { status: 500 });
  }
}

// 2. DELETE NOVEL (DELETE)
export async function DELETE(request, { params }) {
  const { novelSlug } = await params;

  try {
    await dbConnect();

    // Cari novel untuk dapatkan ID-nya dulu
    const novel = await Novel.findOne({ novel_slug: novelSlug });
    if (!novel) {
       return NextResponse.json({ message: 'Novel tidak ditemukan' }, { status: 404 });
    }

    // Hapus Novelnya
    await Novel.findByIdAndDelete(novel._id);

    // OPSIONAL TAPI PENTING: Hapus juga semua chapter milik novel ini
    // Agar tidak jadi sampah di database
    await Chapter.deleteMany({ novel: novel._id });

    return NextResponse.json({ message: 'Novel dan semua chapternya berhasil dihapus' });

  } catch (error) {
    return NextResponse.json({ message: 'Gagal hapus novel', error: error.message }, { status: 500 });
  }
}