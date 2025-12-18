'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Context dengan nilai default
const FontSizeContext = createContext({
  fontSize: 18,
  changeFontSize: () => {}
});

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSize = localStorage.getItem('novel-font-size');
      if (savedSize) {
        setFontSize(parseInt(savedSize));
      }
      setMounted(true);
    }
  }, []);

  // --- INI BAGIAN PENTING YANG SERING TERLEWAT ---
  // Kita harus menempelkan variable '--novel-font-size' ke HTML (root)
  // agar bisa dibaca oleh file CSS Module manapun.
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty('--novel-font-size', `${fontSize}px`);
    }
  }, [fontSize, mounted]);
  // ------------------------------------------------

  const changeFontSize = (amount) => {
    setFontSize((prev) => {
      const newSize = prev + amount;
      // Batas Min 14px, Max 30px
      if (newSize < 14 || newSize > 30) return prev;
      
      localStorage.setItem('novel-font-size', newSize);
      return newSize;
    });
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
      {/* Kita render children LANGSUNG tanpa wrapper div style */}
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);