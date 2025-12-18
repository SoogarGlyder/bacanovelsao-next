'use client'; 

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import styles from './NovelDetailPage.module.css'; 
import { useNovelDetail } from '../../hooks/useNovelData'; // Pastikan path import ini benar
import LoadingSpinner from '../../components/LoadingSpinner'; // Pastikan path benar
import Breadcrumbs from '../../components/Breadcrumbs'; // Pastikan path benar
import { useGlobalContext } from '../providers'; // Pastikan path benar
import { getReadingHistory } from '../../utils/readingHistory'; // Pastikan path benar

// GANTI NAMA FUNCTION JADI NovelClient
export default function NovelClient() {
  const params = useParams();
  // ... SISA KODE SAMA PERSIS SEPERTI YANG KAMU KIRIM ...
  // ... DARI const novelSlug ... SAMPAI TUTUP KURUNG KURAWAL TERAKHIR ...
  const novelSlug = params.novelSlug;
  
  const router = useRouter();
  const { setPageSerie, setDropdownSerie, setIsListOpen } = useGlobalContext();
  
  const [isListVisible, setIsListVisible] = useState(true);
  const [lastRead, setLastRead] = useState(null);

  const {
    novel,
    chapters: allChapters,
    loading,
    error
  } = useNovelDetail(novelSlug);

  useEffect(() => {
    setIsListVisible(window.innerWidth > 767);
    const handleResize = () => {
      setIsListVisible(window.innerWidth > 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (novel) {
        setPageSerie(novel.serie);
        setDropdownSerie(novel.serie);
    }
    setIsListOpen(false); 
    window.scrollTo(0, 0);
  }, [novel, setPageSerie, setDropdownSerie, setIsListOpen]);

  useEffect(() => {
    if (novelSlug) {
      const historyData = getReadingHistory(novelSlug);
      if (historyData) {
        setLastRead(historyData);
      }
    }
  }, [novelSlug]);

  if (loading) return <LoadingSpinner />;
  
  if (error || !novel) {
      return (
        <div className="container" style={{padding: '2rem', textAlign:'center'}}>
          <h2>Novel Tidak Ditemukan</h2>
          <Link href="/" style={{color: '#09f'}}>Kembali ke Beranda</Link>
        </div>
      );
  }

  const firstChapterSlug = allChapters.length > 0 ? allChapters[0].chapter_slug : null;

  return (
    <div className={styles.holyGrailLayout}>
      <aside className={styles.leftSidebar}>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsListVisible(!isListVisible)}>
            Daftar Chapter {isListVisible ? '▴' : '▾'}
        </button>
        
        <h2 className={styles.leftSidebarTitle} style={{ display: isListVisible || window.innerWidth > 767 ? 'block' : 'none' }}>
           Daftar Chapter
        </h2>

        {isListVisible && (
          <ul className={styles.chapterList}>
            <li>
              <Link 
                href={`/${novelSlug}`} 
                className={`${styles.chapterLink} ${styles.activeChapter}`}
              >
              Sinopsis
              </Link>
            </li>
            {allChapters.map((chapterItem) => (
              <li key={chapterItem._id}>
                <Link 
                  href={`/${novelSlug}/${chapterItem.chapter_slug}`}
                  className={styles.chapterLink}
                >
                  {chapterItem.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className={styles.mainContent}>
        <Breadcrumbs 
          items={[
            { label: novel.title, link: `/${novelSlug}` }, 
            { label: `Sinopsis`, link: null } 
          ]} 
        />
        <div className={styles.chapterHeader}>
          <h1>{novel.title}</h1>
          <h2>Sinopsis</h2>
        </div>
        <hr className={styles.divider} />
        
        <div className={styles.content}>
          {(novel.synopsis || '<p>Belum ada sinopsis.</p>').split('\n').map((paragraph, index) => {
            const cleanedHtml = DOMPurify.sanitize(paragraph);
              if (!cleanedHtml.trim()) return null;
              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
              );
          })}
        </div>

        <div className={styles.navigation}>
          {lastRead && (
            <div className={styles.lastRead}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginRight: '20px' }}>
                  Terakhir dibaca:
                </span>
                <strong style={{ color: '#333' }}>
                  {lastRead.chapterTitle}
                </strong>
              </div>
              <Link href={`/${novelSlug}/${lastRead.chapterSlug}`}>
                Lanjut Baca »
              </Link>
            </div>
          )}
          
          {firstChapterSlug && (
             <button 
               onClick={() => router.push(`/${novelSlug}/${firstChapterSlug}`)}
               className={styles.navButton} 
             >
               Chapter Pertama &raquo;
             </button>
          )}
        </div>

        <div className={styles.disclaimer}>
          <p>
            <strong>Disclaimer:</strong> Kami tidak berafiliasi dengan Reki Kawahara, ASCII Media Works, atau 
            pemegang lisensi resmi lainnya. Ini adalah proyek penggemar. Dukung penulis dengan membeli karya aslinya.
          </p>
        </div>
      </main>

      <aside className={styles.rightSidebar}>
        <h3>Dukung Kami Yuk!</h3>
        <a href="https://saweria.co/SoogarGlyder" target="_blank" rel="noreferrer">
          <img src="/saweria.png" alt="QR Code Saweria" width="200"/>
        </a>
      </aside>
    </div>
  );
}