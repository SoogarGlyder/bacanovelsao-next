'use client'; // Wajib karena pakai hooks dan event handler

import React from 'react';
import Link from 'next/link'; // Kita pakai Link, bukan useNavigate
import styles from './Header.module.css'; // Menggunakan style yang sama dengan Header
import { useNovelList } from '../hooks/useNovelData'; // Kita butuh file ini segera
import LoadingSpinner from './LoadingSpinner'; // Kita butuh file ini segera

function NovelList({ activeSerie, onNovelClick }) {
  // Kita fetch data menggunakan custom hook yang lama
  // (Nanti hook-nya perlu sedikit penyesuaian untuk fetching data)
  const { novels, loading, error } = useNovelList(activeSerie);

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    
    // Error handling sederhana
    if (error) return (
      <div className={styles.novelListWrapper} style={{ color: 'white', padding: '20px' }}>
        Error: {error}
      </div>
    );
    
    if (!novels || novels.length === 0) return (
      <div className={styles.novelListWrapper} style={{ color: 'white', padding: '20px' }}>
        Tidak ada novel yang ditemukan.
      </div>
    );
    
    return (
      <div className={styles.novelGallery}>
        {novels.map((novel) => {
          // Construct URL: misal /sword-art-online-001
          // Pastikan slug-nya valid
          const href = `/${novel.novel_slug}`;

          return (
            // Ganti div onClick menjadi Link
            // Ini jauh lebih baik untuk SEO dan Performa Next.js
            <Link 
              key={novel._id} 
              href={href}
              className={styles.contentCover}
              onClick={onNovelClick} // Supaya menu tertutup saat diklik
            >
              {/* Nanti bisa diupgrade pakai <Image /> Next.js.
                 Sekarang pakai <img> dulu biar styling aman.
              */}
              <img 
                src={novel.cover_image || 'https://via.placeholder.com/250x350'} 
                className={styles.contentCoverImg} 
                alt={novel.title} 
              />
              <figcaption className={styles.captionLink}>
                {novel.title}
              </figcaption>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.novelListWrapper}>
      {renderContent()}
    </div>
  );
}

export default NovelList;