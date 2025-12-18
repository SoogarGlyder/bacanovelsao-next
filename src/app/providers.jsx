'use client'; // Menandakan ini berjalan di browser (bisa pakai useState)

import React, { createContext, useContext, useState, useEffect } from 'react';

// Membuat Context (pengganti Outlet context)
const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [pageSerie, setPageSerie] = useState(null);
  const [dropdownSerie, setDropdownSerie] = useState(null);
  const [isListOpen, setIsListOpen] = useState(false);

  // Logic untuk mengunci scroll saat menu terbuka (dari App.jsx lama)
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

  // Data yang akan bisa diakses oleh semua halaman
  const value = {
    pageSerie,
    setPageSerie,
    dropdownSerie,
    setDropdownSerie,
    isListOpen,
    setIsListOpen,
    activeSerie
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook biar gampang dipanggil di halaman lain
export const useGlobalContext = () => useContext(GlobalContext);