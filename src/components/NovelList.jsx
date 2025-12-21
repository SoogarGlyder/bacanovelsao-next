'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useNovelList } from '../hooks/useNovelData';
import LoadingSpinner from './LoadingSpinner';

function NovelList({ activeSerie, onNovelClick }) {
  const { novels, loading, error } = useNovelList(activeSerie);

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;

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
          const href = `/${novel.novel_slug}`;
          return (
            <Link 
              key={novel._id} 
              href={href}
              className={styles.contentCover}
              onClick={onNovelClick}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  src={novel.cover_image || 'https://via.placeholder.com/250x350'}
                  alt={novel.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className={styles.contentCoverImg}
                  priority={false}
                />
              </div>
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