'use client';

import React from 'react';
import Link from 'next/link';
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