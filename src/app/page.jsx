'use client'; // Wajib karena pakai useEffect

import React, { useEffect } from 'react';
import { useGlobalContext } from './providers'; // Import context global kita

export default function HomePage() {
  const { setPageSerie, setDropdownSerie, setIsListOpen, isListOpen } = useGlobalContext();

  useEffect(() => {
    // Logic lama: Set seri default ke 'main' dan buka menu
    setPageSerie('main');       
    setDropdownSerie('main');
    setIsListOpen(true);
  }, [setPageSerie, setDropdownSerie, setIsListOpen]);
  
  return (
    // Pastikan class 'container' ada di globals.css atau buat module.css
    // Saya sarankan pakai style inline sementara atau pindahkan CSS-nya
    <div className="container">
      
      {/* Catatan: Komponen <SEO /> dihapus.
        Metadata (Title/Description) untuk halaman Home sudah diatur di layout.jsx.
      */}

      {!isListOpen && (
        <>
          <h1>Selamat Datang</h1>
          <h3>Silakan pilih seri novel dari navigasi di atas.</h3>
        </>
      )}
    </div>
  );
}