'use client';

import React, { useState } from 'react';
import CategoryFilter from '@/components/Home/CategoryFilter';
import HomeGrid from '@/components/Home/HomeGrid';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: '20px'
    }}>
      <CategoryFilter 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <HomeGrid activeSerie={activeTab} />
    </div>
  );
}