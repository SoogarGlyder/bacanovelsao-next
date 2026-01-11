'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WikiIndex.module.css';

export default function WikiList({ allData }) {
  // Kita butuh 3 State sekarang (Search, Type, Series)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [seriesFilter, setSeriesFilter] = useState('all');

  // Logic Filter Kombinasi (Search AND Type AND Series)
  const filteredData = allData.filter(([slug, data]) => {
    // 1. Cek Pencarian (Nama Karakter)
    // Ubah ke huruf kecil semua agar tidak sensitif huruf besar/kecil
    const matchSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Cek Jenis (Type)
    const matchType = typeFilter === 'all' || data.type === typeFilter;

    // 3. Cek Seri (Series)
    const matchSeries = seriesFilter === 'all' || (data.series && data.series.includes(seriesFilter));

    // Hanya lolos jika KETIGANYA true
    return matchSearch && matchType && matchSeries;
  });

  // Tombol Reset sekarang mereset Search juga
  const handleReset = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSeriesFilter('all');
  };

  return (
    <>
      {/* AREA FILTER BAR */}
      <div className={styles.filterBar}>
        
        {/* 🔥 ITEM BARU: SEARCH BAR */}
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            placeholder="Cari karakter..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Dropdown 1: JENIS */}
        <div className={styles.selectWrapper}>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.dropdown}
          >
            <option value="all">Semua Jenis</option>
            <option value="character">Karakter</option>
            <option value="guild">Guild</option>
            <option value="location">Lokasi</option>
            <option value="race">Ras</option>
          </select>
        </div>

        {/* Dropdown 2: ARC / SERI */}
        <div className={styles.selectWrapper}>
          <select 
            value={seriesFilter} 
            onChange={(e) => setSeriesFilter(e.target.value)}
            className={styles.dropdown}
          >
            <option value="all">Semua Seri</option>
            <option value="sao">Aincrad (SAO)</option>
            <option value="alo">Fairy Dance (ALO)</option>
            <option value="ggo">Phantom Bullet (GGO)</option>
            <option value="alicization">Alicization</option>
            <option value="progressive">SAO Progressive</option>
          </select>
        </div>

        {/* Tombol Reset (Muncul jika ada filter aktif) */}
        {(searchQuery !== '' || typeFilter !== 'all' || seriesFilter !== 'all') && (
          <button onClick={handleReset} className={styles.resetBtn}>
            Reset
          </button>
        )}

      </div>

      {/* GRID HASIL */}
      <div className={styles.grid}>
        {filteredData.map(([slug, data]) => {
          const thumbnail = data.images && data.images.length > 0 ? data.images[0].url : null;

          return (
            <Link key={slug} href={`/wiki/${slug}`} className={styles.card}>
              <div className={styles.imageFrame}>
                {thumbnail ? (
                  <Image 
                    src={thumbnail} alt={data.name} fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                ) : (
                  <div className={styles.placeholder}>?</div>
                )}
                <span className={`${styles.badge} ${styles[data.type]}`}>
                  {data.type}
                </span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{data.name}</h3>
                <p className={styles.cardSubtitle}>{data.subtitle}</p>
              </div>
            </Link>
          );
        })}

        {filteredData.length === 0 && (
          <div className={styles.emptyState}>
            Tidak ditemukan data &quot;{searchQuery}&quot; dengan filter tersebut.
          </div>
        )}
      </div>
    </>
  );
}