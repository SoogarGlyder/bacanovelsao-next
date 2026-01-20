'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; 
import { usePathname, useRouter } from 'next/navigation'; 
import { useTheme } from 'next-themes'; // 1. Import Theme
import { FaSun, FaMoon } from 'react-icons/fa'; // 2. Import Icon
import styles from './Header.module.css';
import { useGlobalContext } from '../app/providers'; 
import NovelList from './NovelList';
import ReadingProgressBar from '@/components/ReadingProgressBar';

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

  // 3. Setup Theme Logic
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname(); 
  const router = useRouter();     
  const navRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});
  
  const isActive = (path) => pathname ? pathname.startsWith(path) : false;
  const isHomePage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');
  
  const isWikiPage = pathname?.startsWith('/wiki');
  const isBlogPage = pathname?.startsWith('/blog') || pathname?.startsWith('/articles');
  const isTimelinePage = pathname?.startsWith('/timeline') || pathname?.startsWith('/urutan');
  const isOtherPage = isWikiPage || isBlogPage || isTimelinePage;

  const isChapterPage = pathname && !isOtherPage && !isHomePage && !isAdminPage
    ? pathname.split('/').filter(Boolean).length === 2 
    : false;

  useEffect(() => {
    setIsListOpen(false);
  }, [pathname, setIsListOpen]);

  // 4. Pastikan component mounted sebelum render icon theme (mencegah hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // ... (kode updateMask dan handleTabClick biarkan sama) ...
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
    if (!isHomePage) {
      updateMask();
      window.addEventListener('resize', updateMask);
      return () => window.removeEventListener('resize', updateMask);
    }
  }, [isHomePage]);

  const handleTabClick = (serieId) => {
    if (serieId === dropdownSerie && isListOpen) {
      setIsListOpen(false);
    } else {
      setDropdownSerie(serieId);
      setIsListOpen(true);
    }
  };

  // 5. Fungsi Toggle
  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  if (isAdminPage) {
      return null;
  }

  return (
    <>
      <div className={styles.headerBar}>
        <div className={styles.topBar}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logoLink}>
                <img src="/header-sao.svg" alt="Link Start" className={styles.logoImg} />
            </Link>
            
            {/* Navigasi Utama */}
            <nav className={styles.topNav}>
              <Link 
                href="/blog" 
                className={`${styles.navItem} ${isActive('/blog') || isActive('/articles') ? styles.navActive : ''}`}
              >
                Blog
              </Link>
              <Link 
                href="/wiki" 
                className={`${styles.navItem} ${isActive('/wiki') ? styles.navActive : ''}`}
              >
                Wiki
              </Link>
              <Link 
                href="/timeline" 
                className={`${styles.navItem} ${pathname?.includes('timeline') || pathname?.includes('urutan') ? styles.navActive : ''}`}
              >
                Kronologis
              </Link>

              {/* 6. TOMBOL TOGGLE TEMA (Disini posisinya) */}
              <button 
                className={styles.themeToggleBtn}
                onClick={toggleTheme}
                aria-label="Ganti Tema"
              >
                {/* Render icon hanya jika mounted agar tidak error hydration */}
                {mounted && (resolvedTheme === 'dark' ? <FaSun /> : <FaMoon />)}
              </button>

            </nav>
          </div>
        </div>

        {!isHomePage && (
          <nav
            className={styles.navContainer}
            ref={navRef}
            onScroll={updateMask}
            style={maskStyle}
            >
            {seriesTabs.map((tab) => {
              const isActiveByReading = !isOtherPage && activeSerie === tab.id;
              const isActiveByDropdown = isListOpen && dropdownSerie === tab.id;
              const showAsActive = isActiveByReading || isActiveByDropdown;

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
        {isChapterPage && <ReadingProgressBar />}
      </div>

      {!isHomePage && isListOpen && (
        <NovelList 
          activeSerie={dropdownSerie}
          onNovelClick={() => setIsListOpen(false)}
          navigate={router.push} 
          isOverlay={true}
       />
      )}
    </>
  );
}

export default Header;