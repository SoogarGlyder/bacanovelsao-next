'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNovelList } from '@/hooks/useNovelData';
import styles from './HomeGrid.module.css';
import LoadingSpinner from '../LoadingSpinner';

export default function HomeGrid({ activeSerie }) {
  const { novels, loading, error } = useNovelList(activeSerie);
  
  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        Error: {error}
      </div>
    );
  }
  
  if (!novels || novels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', opacity: 0.7, color: 'var(--foreground)' }}>
        <p>Belum ada novel di kategori ini.</p>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {novels.map((novel) => {
        const href = `/${novel.novel_slug}`; 
        return (
          <Link 
            key={novel._id} 
            href={href}
            className={styles.card}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image 
                src={novel.cover_image || 'https://via.placeholder.com/250x350'}
                alt={novel.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className={styles.cardImage}
                priority={false}
              />
            </div>
            <figcaption className={styles.caption}>
              {novel.title}
            </figcaption>
          </Link>
        );
      })}
    </div>
  );
}