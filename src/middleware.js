import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  // Ganti dengan domain barumu
  const targetDomain = 'linkstart.id';

  // Cek apakah user mengakses lewat domain lama (.vercel.app)
  // Kita hanya redirect jika environment adalah PRODUCTION
  if (process.env.NODE_ENV === 'production' && 
      hostname.includes('vercel.app')) {
      
    url.hostname = targetDomain;
    url.protocol = 'https';
    url.port = ''; // Hapus port jika ada
    
    // Lakukan Redirect 301 (Permanen)
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware berjalan di semua halaman
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};