'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './WikiDetail.module.css';

export default function WikiImageViewer({ images, altText }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images && images.length > 0 ? images[selectedIndex] : null;

  if (!currentImage) {
    return <div className={styles.placeholder}>NO IMAGE</div>;
  }

  return (
    <div className={styles.viewerContainer}>
      {images.length > 1 && (
        <div className={styles.tabHeader}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`${styles.tabLink} ${selectedIndex === idx ? styles.activeTabLink : ''}`}
            >
              {img.label}
            </button>
          ))}
        </div>
      )}
      <div className={styles.imageWrapper}>
        <Image 
          src={currentImage.url}
          alt={`${altText} - ${currentImage.label}`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ objectFit: 'cover' }}
          priority
          className={styles.animatedImage}
          key={currentImage.url} 
        />
      </div>

    </div>
  );
}