'use client'; // Wajib karena pakai hooks (useState, useEffect, dll)

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Pengganti react-router-dom Link
import { usePathname, useRouter } from 'next/navigation'; // Pengganti useLocation, useNavigate
import styles from './Header.module.css';
import { useGlobalContext } from '../app/providers'; // Ambil state global
import NovelList from './NovelList'; // Kita butuh file ini nanti

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
  // 1. Ambil state dari GlobalContext (bukan dari props lagi)
  const { 
    activeSerie, 
    isListOpen, 
    setIsListOpen, 
    dropdownSerie, 
    setDropdownSerie 
  } = useGlobalContext();

  // 2. Ganti Hooks Router
  const pathname = usePathname(); // ganti useLocation
  const router = useRouter();     // ganti useNavigate
  const navRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});

  // Logic Masking (Tidak berubah)
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

  // Logic reset menu saat pindah halaman
  useEffect(() => {
    if (pathname !== '/') {
      setIsListOpen(false);
    }
  }, [pathname]); // dependencies ganti ke pathname

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
            {/* Ganti a href dengan Link next/link */}
            <Link href="/" className={styles.imgHeader}>
                {/* Catatan: Bisa di-upgrade ke component <Image /> Next.js nanti.
                  Untuk sekarang pakai <img> biasa biar CSS-nya aman. 
                  Pastikan file header-sao.svg ada di folder /public 
                */}
                <img src="/header-sao.svg"
                     alt="Logo"
                     style={{ height: '100%' }}
                />
            </Link>
        </div>
        
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
      </div>

      {isListOpen && (
        <NovelList 
          activeSerie={dropdownSerie}
          onNovelClick={() => setIsListOpen(false)}
          navigate={router.push} // Pass router.push sebagai pengganti navigate
       />
      )}
    </>
  );
}

export default Header;