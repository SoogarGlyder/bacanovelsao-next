'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import styles from './ChapterReadPage.module.css'; // Pastikan path CSS benar
import { useChapterData, useNovelList } from '../../../hooks/useNovelData'; // Pastikan path hooks benar
import LoadingSpinner from '../../../components/LoadingSpinner';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useGlobalContext } from '../../providers'; 
import ReadingProgressBar from '../../../components/ReadingProgressBar';
import { saveReadingHistory } from '../../../utils/readingHistory';

export default function ChapterClient() {
  const params = useParams();
  const { novelSlug, chapterSlug } = params;
  const router = useRouter();
  
  const { setPageSerie } = useGlobalContext();
  const [isListVisible, setIsListVisible] = useState(true);

  const {
    chapter, 
    loading, 
    error, 
    prevChapterSlug, 
    nextChapterSlug, 
    allChapters
  } = useChapterData(novelSlug, chapterSlug, setPageSerie);

  const currentSerie = chapter?.novel?.serie;
  const { novels: serieNovels } = useNovelList(currentSerie);

  useEffect(() => {
    setIsListVisible(window.innerWidth > 767);
    const handleResize = () => setIsListVisible(window.innerWidth > 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chapter && chapter.novel) {
       saveReadingHistory(
          chapter.novel.novel_slug,
          chapter.chapter_slug,
          chapter.title,
          chapter.chapter_number
       );
    }
  }, [chapter]);

  if (loading) return <LoadingSpinner />;
  
  if (error || !chapter) {
     return (
        <div className="container" style={{padding:'2rem', textAlign:'center'}}>
          <h3>Chapter tidak ditemukan</h3>
          <Link href={`/${novelSlug}`} style={{color:'#09f'}}>Kembali ke Daftar Chapter</Link>
        </div>
     );
  }

  const wordCount = chapter.content ? chapter.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className={styles.holyGrailLayout}>
      <ReadingProgressBar />
       <aside className={styles.leftSidebar}>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsListVisible(!isListVisible)}>
          Daftar Chapter {isListVisible ? '▴' : '▾'}
        </button>

        <h2 className={styles.leftSidebarTitle}>
           Daftar Chapter
        </h2>
        
        {isListVisible && (
            <ul className={styles.chapterList}>
              <li>
                <Link href={`/${novelSlug}`} className={styles.chapterLink}>
                  Sinopsis
                </Link>
              </li>
              {allChapters.map((item) => (
                <li key={item._id}>
                  <Link 
                    href={`/${novelSlug}/${item.chapter_slug}`}
                    className={`${styles.chapterLink} ${
                      item.chapter_slug === chapterSlug ? styles.activeChapter : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
        )}
      </aside>

      <main className={styles.mainContent}>
            <Breadcrumbs 
              items={[
                { label: chapter.novel.title, link: `/${novelSlug}` }, 
                { label: chapter.title, link: null } 
              ]} 
            />
            <div className={styles.chapterHeader}>
              <h1>{chapter.novel.title}</h1>
              <h4>{chapter.title}</h4>
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                  Estimasi waktu baca: {readingTime} menit
              </span>
            </div>
            
            <hr className={styles.divider} />
            
      <div className={styles.content}>
        {(chapter.content || '').split('\n').map((paragraph, index) => {
          const cleanedHtml = DOMPurify.sanitize(paragraph);
          if (!cleanedHtml.trim()) return null;
          return <p key={index} dangerouslySetInnerHTML={{ __html: cleanedHtml }} />;
        })}
      </div>

            <div className={styles.navigation}>
              <button 
                onClick={() => {
                  if (prevChapterSlug) router.push(`/${novelSlug}/${prevChapterSlug}`);
                  else router.push(`/${novelSlug}`);
                }}
              >
                {prevChapterSlug ? '« Chapter Sebelumnya' : '« Sinopsis'}
              </button>

              <button 
                onClick={() => {
                  if (nextChapterSlug) {
                    router.push(`/${novelSlug}/${nextChapterSlug}`);
                  } else {
                    if (serieNovels && serieNovels.length > 0) {
                      const idx = serieNovels.findIndex(n => n.novel_slug === novelSlug);
                      if (idx !== -1 && idx < serieNovels.length - 1) {
                         router.push(`/${serieNovels[idx + 1].novel_slug}`);
                      } else {
                         router.push('/');
                      }
                    } else {
                      router.push('/');
                    }
                  }
                }}
              >
                {nextChapterSlug ? 'Chapter Selanjutnya »' : 'Novel Selanjutnya »'}
              </button>
            </div>
      </main>

      <aside className={styles.rightSidebar}>
        <h3>Dukung Kami Yuk!</h3>
        <a href="https://saweria.co/SoogarGlyder" target="_blank">
          <img src="/saweria.png" alt="Saweria" width="200"/>
        </a>
      </aside>
    </div>
  );
}