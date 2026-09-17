'use client';

import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus, FaRedoAlt, FaShoppingBag, FaHeart } from 'react-icons/fa';

import { useFontSize } from '@/contexts/FontSizeContext';
import styles from './RightSidebar.module.css'; 

export default function RightSidebar({ affiliateData }) {
  const { changeFontSize, resetFontSize } = useFontSize();
  const hasAffiliate = affiliateData && affiliateData.link && affiliateData.image && affiliateData.title;

  // 🔥 State untuk mengontrol kemunculan Smartlink
  const [smartlinkEnabled, setSmartlinkEnabled] = useState(false);

  useEffect(() => {
    // Membaca status iklan dari API saat komponen dimuat
    fetch('/api/admin/ads-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.smartlink) {
          setSmartlinkEnabled(true);
        }
      })
      .catch((err) => console.error('Gagal memuat status iklan:', err));
  }, []);

  return (
    <aside className={styles.rightSidebar}>
      
      <div className={styles.rightContainer}>
        <h3 className={styles.sidebarTitle}>Ukuran Font</h3>
        <div className={styles.fontControlButtons}>
          <button 
            onClick={() => changeFontSize(-1)} 
            className={styles.fontBtn} 
            title="Kecilkan Huruf"
          >
            <FaMinus />
          </button>
          <button 
            onClick={resetFontSize} 
            className={styles.fontBtn} 
            title="Reset Ukuran Huruf"
          >
            <FaRedoAlt />
          </button>
          <button 
            onClick={() => changeFontSize(1)} 
            className={styles.fontBtn} 
            title="Besarkan Huruf"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className={styles.stickyWrapper}>
        
        {hasAffiliate && (
          <div className={styles.rightContainer}>
            <h3 className={styles.sidebarTitle}>Koleksi Merch</h3>
            <div className={styles.affiliateImageWrapper}>
              <img 
                src={affiliateData.image} 
                alt={affiliateData.title} 
                className={styles.affiliateImage} 
              />
            </div>
            <p className={styles.affiliateTitle}>
              {affiliateData.title}
            </p>
            <a 
              href={affiliateData.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.affiliateLink}
            >
              <div className={styles.affiliateBtn}>
                 Cek di Shopee <FaShoppingBag />
              </div>
            </a>
          </div>
        )}

        <div className={styles.rightContainer}>
          <h3 className={styles.sidebarTitle}>Dukung Kami Yuk!</h3>
          <a href="https://saweria.co/SoogarGlyder" target="_blank" rel="noreferrer">
            <img className={styles.saweria} src="/saweria.png" alt="QR Code Saweria"/>
          </a>
          
          {/* 🔥 Tombol Smartlink Adsterra */}
          {smartlinkEnabled && (
            <a 
              href="https://www.profitableratecpmnetwork.com/rwjjha29?key=ac45b9b5b220f7d7e6bb5c063798a2c6" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.smartlinkBtn}
            >
              Support Kami Yuk! <FaHeart style={{ marginLeft: '5px' }}/>
            </a>
          )}
        </div>

      </div>

    </aside>
  );
}