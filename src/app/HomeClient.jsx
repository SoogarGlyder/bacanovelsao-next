'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../components/Header.module.css';
import NovelList from '../components/NovelList';
import Footer from '@/components/Footer';

const seriesTabs = [
  { id: 'main', name: 'Main' },
  { id: 'progressive', name: 'Progressive' },
  { id: 'ggo', name: 'Gun Gale Online' },
  { id: 'clover', name: "Clover's Regret" },
  { id: 'anthology', name: 'Anthology' },
  { id: 'gourmet', name: 'Gourmet Seekers' },
  { id: 'mystery', name: 'Mystery Labyrinth' },
];

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState('main');
  const navRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});
  const updateMask = () => {
    const el = navRef.current;
    if (!el) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollWidth - scrollLeft - clientWidth <= 1; 
    
    let maskImage = '';

    if (window.innerWidth > 1023) {
      maskImage = ''; 
    } else if (isAtStart) {
      maskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
    } else if (isAtEnd) {
      maskImage = 'linear-gradient(to right, transparent 0%, black 15%)'; 
    } else {
      maskImage = 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)';
    }

    setMaskStyle({
      maskImage: maskImage,
      WebkitMaskImage: maskImage
    });
  };

  useEffect(() => {
    updateMask();
    window.addEventListener('resize', updateMask);
    return () => window.removeEventListener('resize', updateMask);
  }, []);

  return (
    <>
      <nav
        className={styles.navContainer}
        ref={navRef}
        onScroll={updateMask}
        style={{
          marginTop: 'calc(0px - var(--nav-height))',
          ...maskStyle 
        }} 
      >
        {seriesTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.navContent} ${
              activeTab === tab.id ? styles.active : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </div>
        ))}
      </nav>
      <NovelList 
        activeSerie={activeTab} 
        onNovelClick={() => {}}
      />
    </>
  );
}