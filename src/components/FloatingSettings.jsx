'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useFontSize } from '@/contexts/FontSizeContext';
import { FaPlus, FaMinus, FaCog, FaSun, FaMoon } from 'react-icons/fa'; 
import styles from './FloatingSettings.module.css';

export default function FloatingSettings() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const { setTheme, resolvedTheme } = useTheme();
  const { changeFontSize } = useFontSize();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <div className={`${styles.container} ${isOpen ? styles.active : ''}`}>
      
      {/* Tombol Utama (Gear) */}
      <button 
        className={`${styles.mainBtn} ${isOpen ? styles.open : ''}`} 
        onClick={toggleMenu}
        aria-label="Pengaturan"
      >
        <FaCog /> 
      </button>

      {/* --- MENU ITEM --- */}

      {/* 2. Tombol Theme (Gunakan Ikon FaSun / FaMoon) */}
      <button 
        className={styles.actionBtn}
        onClick={toggleTheme}
        title="Ganti Tema"
        aria-label="Ganti Tema"
      >
        {/* LOGIKA: Jika sedang Dark Mode, tampilkan Matahari (untuk ke Light).
            Jika sedang Light Mode, tampilkan Bulan (untuk ke Dark). */}
        {resolvedTheme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>

      {/* Tombol Font - */}
      <button 
        className={styles.actionBtn}
        onClick={() => changeFontSize(-1)}
        title="Kecilkan Huruf"
        aria-label="Kecilkan Huruf"
        style={{ fontSize: '0.9rem' }} // Sedikit disesuaikan ukurannya
      >
        <FaMinus />
      </button>

      {/* Tombol Font + */}
      <button 
        className={styles.actionBtn}
        onClick={() => changeFontSize(1)}
        title="Besarkan Huruf"
        aria-label="Besarkan Huruf"
        style={{ fontSize: '0.9rem' }}
      >
        <FaPlus />
      </button>

    </div>
  );
}