export const stripHtml = (html) => {
  if (!html) return '';
  // 1. Ganti <br> dengan spasi
  let text = html.replace(/<br\s*\/?>/gi, ' ');
  // 2. Hapus semua tag HTML
  text = text.replace(/<[^>]+>/g, '');
  // 3. Hapus spasi berlebih & decode entities standar
  text = text.replace(/\s+/g, ' ').trim();
  
  // 4. Potong jika terlalu panjang (Standar SEO: 150-160 karakter)
  if (text.length > 160) {
      return text.substring(0, 160) + '...';
  }
  return text;
};