'use client';

import React, { useEffect } from 'react';
import { useGlobalContext } from './providers';
import HomeClient from './HomeClient';

export default function HomePage() {
  const { setPageSerie, setDropdownSerie, setIsListOpen, isListOpen } = useGlobalContext();

  useEffect(() => {
    setPageSerie('main');       
    setDropdownSerie('main');
    setIsListOpen(true);
  }, [setPageSerie, setDropdownSerie, setIsListOpen]);
  
  return <HomeClient />;
}