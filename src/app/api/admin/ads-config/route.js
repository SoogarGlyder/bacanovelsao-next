import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'ads-config.json');

const defaultConfig = { 
  sociobar: true, 
  popunder: true, 
  nativeBanner: true, 
  smartlink: true 
};

const ensureFileExists = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));
  }
};

export async function GET() {
  try {
    ensureFileExists();
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(defaultConfig);
  }
}

export async function POST(request) {
  try {
    ensureFileExists();
    const body = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}