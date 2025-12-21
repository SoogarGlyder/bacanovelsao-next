'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; 
import { usePathname, useRouter } from 'next/navigation'; 
import styles from './Header.module.css';
import { useGlobalContext } from '../app/providers'; 
import NovelList from './NovelList'; 

const seriesTabs = [
  { id: 'main', name: 'Main' },
  { id: 'progressive', name: 'Progressive' },
  { id: 'ggo', name: 'Gun Gale Online' },
  { id: 'clover', name: "Clover's Regret" },
  { id: 'anthology', name: 'Anthology' },
  { id: 'gourmet', name: 'Gourmet Seekers' },
  { id: 'mystery', name: 'Mystery Labyrinth' },
];

function Header() {
  const { 
    activeSerie, 
    isListOpen, 
    setIsListOpen, 
    dropdownSerie, 
    setDropdownSerie 
  } = useGlobalContext();

  const pathname = usePathname(); 
  const router = useRouter();     
  const navRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});

  const isHomePage = pathname === '/';

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
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      setIsListOpen(false);
    }
  }, [pathname, isHomePage, setIsListOpen]);

  const handleTabClick = (serieId) => {
    if (serieId === activeSerie && isListOpen) {
      setIsListOpen(false);
    } else {
      setDropdownSerie(serieId);
      setIsListOpen(true);
    }
  };

  return (
    <>
      <div className={styles.headerBar}>
        <div className={styles.containerImgHeader}>
            <Link href="/" className={styles.imgHeader}>
                <img src="/header-sao.svg"
                     alt="Logo"
                     style={{ height: '100%' }}
                />
            </Link>
        </div>
        {!isHomePage && (
          <nav
            className={styles.navContainer}
            ref={navRef}
            onScroll={updateMask}
            style={maskStyle}
            >
            {seriesTabs.map((tab) => {
              const showAsActive = activeSerie === tab.id;
              return (
                <div
                  key={tab.id}
                  className={`${styles.navContent} ${
                    showAsActive ? styles.active : ''
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.name}
                </div>
              );
            })}
          </nav>
        )}
      </div>
      {!isHomePage && isListOpen && (
        <NovelList 
          activeSerie={dropdownSerie}
          onNovelClick={() => setIsListOpen(false)}
          navigate={router.push} 
       />
      )}
    </>
  );
}

export default Header;