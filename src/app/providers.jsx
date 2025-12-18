'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes'; // 1. Import ThemeProvider

// Membuat Context (Navigasi & Global State)
const GlobalContext = createContext();

// Ubah nama fungsi export jadi "Providers" agar lebih umum
export function Providers({ children }) {
  // --- LOGIC LAMA (Navigasi) ---
  const [pageSerie, setPageSerie] = useState(null);
  const [dropdownSerie, setDropdownSerie] = useState(null);
  const [isListOpen, setIsListOpen] = useState(false);

  // Logic kunci scroll saat menu mobile terbuka
  useEffect(() => {
    if (isListOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isListOpen]);

  const activeSerie = isListOpen ? dropdownSerie : pageSerie;

  const value = {
    pageSerie,
    setPageSerie,
    dropdownSerie,
    setDropdownSerie,
    isListOpen,
    setIsListOpen,
    activeSerie
  };

  // --- RENDER ---
  // Kita bungkus GlobalContext di dalam ThemeProvider
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <GlobalContext.Provider value={value}>
        {children}
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}

// Custom hook biar gampang dipanggil di halaman lain
export const useGlobalContext = () => useContext(GlobalContext);