'use client';
import React, { useEffect } from 'react';

export default function NativeAd({ isEnabled }) {
  // Jika dimatikan dari admin, jangan render apa-apa
  if (!isEnabled) return null;

  useEffect(() => {
    // Mencegah script dipanggil dua kali (strict mode)
    if (!document.getElementById('adsterra-native-script')) {
      const script = document.createElement('script');
      script.id = 'adsterra-native-script';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31370950.profitableratecpmnetwork.com/57f96cfddcc0d54da265ca8970d93591/invoke.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      id="container-57f96cfddcc0d54da265ca8970d93591" 
      style={{ margin: '20px auto', textAlign: 'center', minHeight: '50px' }}
    >
      {/* Iklan akan otomatis ter-render di dalam div ini oleh script Adsterra */}
    </div>
  );
}