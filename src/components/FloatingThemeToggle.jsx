'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './FloatingThemeToggle.module.css';

export default function FloatingThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Hindari error hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  // Tentukan apakah sedang dark mode (cek resolvedTheme untuk system preference)
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <button
      className={styles.floatingBtn}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Ganti Tema Gelap/Terang"
      title={isDark ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}