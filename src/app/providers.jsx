'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes'; 
import { FontSizeProvider } from '@/contexts/FontSizeContext';

// Membuat Context (Navigasi & Global State)
const GlobalContext = createContext();

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

  // Nilai yang akan disebar ke seluruh aplikasi
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
  return (
    // 1. ThemeProvider (Dark/Light Mode)
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      
      {/* 2. FontSizeProvider (Ukuran Huruf) */}
      <FontSizeProvider>
        
        {/* 3. GlobalContext (Navigasi & State Menu) - TADI INI HILANG */}
        <GlobalContext.Provider value={value}>
          {children}
        </GlobalContext.Provider>
        
      </FontSizeProvider>

    </ThemeProvider>
  );
}

// Custom hook biar gampang dipanggil di halaman lain
export const useGlobalContext = () => useContext(GlobalContext);