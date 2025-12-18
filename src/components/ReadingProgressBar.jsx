'use client'; // Wajib! Karena pakai window & hooks

import React, { useEffect, useState } from 'react';

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  const scrollHeight = () => {
    // Cek safety guard agar tidak error di server (meski useEffect aman)
    if (typeof window === 'undefined') return;

    const el = document.documentElement;
    const ScrollTop = el.scrollTop || document.body.scrollTop;
    const ScrollHeight = el.scrollHeight || document.body.scrollHeight;
    
    const clientHeight = el.clientHeight;
    
    // Mencegah pembagian dengan nol
    if (ScrollHeight - clientHeight <= 0) {
        setWidth(0);
        return;
    }

    const percent = (ScrollTop / (ScrollHeight - clientHeight)) * 100;
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHeight);
    // Cleanup function untuk mencegah memory leak saat pindah halaman
    return () => window.removeEventListener('scroll', scrollHeight);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      // Gunakan fallback '60px' jika variabel CSS belum ter-load
      top: 'var(--total-header-height, 60px)', 
      left: 0,
      width: `${width}%`,
      height: '4px', // Ketebalan bar
      backgroundColor: '#38b6ff', // Warna Biru SAO
      zIndex: 9999,
      transition: 'width 0.1s ease-out'
    }} />
  );
};

export default ReadingProgressBar;