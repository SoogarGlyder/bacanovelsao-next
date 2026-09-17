import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

const defaultConfig = { 
  sociobar: true, 
  popunder: true, 
  nativeBanner: true, 
  smartlink: true 
};

export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: 'adsConfig' }).lean();
    
    if (setting && setting.value) {
      // Gabungkan dengan default untuk mencegah error jika ada key yang hilang
      return NextResponse.json({ ...defaultConfig, ...setting.value });
    }
    return NextResponse.json(defaultConfig);
  } catch (error) {
    console.error('Gagal mengambil ads config:', error);
    return NextResponse.json(defaultConfig);
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Menyimpan atau memperbarui dokumen dengan key 'adsConfig'
    await Setting.findOneAndUpdate(
      { key: 'adsConfig' },
      { value: body },
      { upsert: true, new: true } // upsert: buat baru jika belum ada
    );
    
    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    console.error('Gagal menyimpan ads config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}