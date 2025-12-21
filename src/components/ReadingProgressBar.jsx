'use client';

import React, { useEffect, useState } from 'react';

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  const scrollHeight = () => {
    if (typeof window === 'undefined') return;

    const el = document.documentElement;
    const ScrollTop = el.scrollTop || document.body.scrollTop;
    const ScrollHeight = el.scrollHeight || document.body.scrollHeight;
    const clientHeight = el.clientHeight;
    
    if (ScrollHeight - clientHeight <= 0) {
        setWidth(0);
        return;
    }

    const percent = (ScrollTop / (ScrollHeight - clientHeight)) * 100;
    setWidth(percent);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollHeight);
    return () => window.removeEventListener('scroll', scrollHeight);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 'var(--total-header-height, 60px)', 
      left: 0,
      width: `${width}%`,
      height: '4px',
      backgroundColor: '#38b6ff',
      zIndex: 9999,
      transition: 'width 0.1s ease-out'
    }} />
  );
};

export default ReadingProgressBar;