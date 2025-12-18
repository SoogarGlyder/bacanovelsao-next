import Link from 'next/link'; // Ganti react-router-dom dengan next/link

// Metadata khusus untuk halaman 404
export const metadata = {
  title: '404 | Halaman Tidak Ditemukan',
};

export default function NotFound() {
  return (
    <div style={{ alignContent: 'center', textAlign: 'center', height: '70vh' }}>
      
      {/* Komponen <SEO /> dihapus, diganti export metadata di atas */}
      
      <h1 style={{ fontSize: '3em', color: '#333'}}>404</h1>
      <h3 style={{ marginTop: '10px', color: '#666', marginBottom: '5px' }}>
        Waduh! Halaman Tidak Ditemukan
      </h3>
      <p style={{ marginBottom: '10px' }}>
        Sepertinya halaman yang kamu cari sudah ditebas oleh Kirito.
      </p>
      
      {/* Ganti 'to' menjadi 'href' */}
      <Link 
        href="/" 
        style={{ 
          display: 'inline-block', 
          marginTop: '20px', 
          padding: '10px 20px', 
          background: '#38b6ff', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}