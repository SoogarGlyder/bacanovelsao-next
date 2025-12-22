'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import parse, { domToReact } from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import styles from './ChapterReadPage.module.css';
import { useNovelList } from '../../../hooks/useNovelData';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { useGlobalContext } from '../../providers'; 
import ReadingProgressBar from '../../../components/ReadingProgressBar';
import { saveReadingHistory } from '../../../utils/readingHistory';
import CommentSection from '../../../components/CommentSection';

export default function ChapterClient({
  novel, 
  chapter, 
  allChapters, 
  prevChapter, 
  nextChapter 
}) {
  const router = useRouter();
  const { setPageSerie } = useGlobalContext();
  const [isListVisible, setIsListVisible] = useState(true);
  const novelSlug = novel.novel_slug;
  const chapterSlug = chapter.chapter_slug;
  const { novels: serieNovels } = useNovelList(novel.serie);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter]);

  useEffect(() => {
    setIsListVisible(window.innerWidth > 767);
    const handleResize = () => setIsListVisible(window.innerWidth > 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (novel && novel.serie) {
      setPageSerie(novel.serie);
    }

    if (chapter && novel) {
       saveReadingHistory(
          novel.novel_slug,
          chapter.chapter_slug,
          chapter.title,
          chapter.chapter_number
       );
    }
  }, [novel, chapter, setPageSerie]);
  
  if (!chapter || !novel) return null;

  const wordCount = chapter.content ? chapter.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const options = {
    replace: (domNode) => {
      if (domNode.type === 'tag' && domNode.name === 'img') {
        const { src, alt } = domNode.attribs;
        return (
          <div className={styles.optimizedImageWrapper}>
            <Image 
              src={src}
              alt={alt || 'Ilustrasi Novel'}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 800px"
              style={{ width: '100%', height: 'auto' }}
              loading="lazy"
              quality={85}
            />
          </div>
        );
      }
      
      if (domNode.attribs && domNode.attribs.class === 'chapter-image-center') {
         return (
             <div className={styles.imageContainer}>
                 {domToReact(domNode.children, options)}
             </div>
         );
      }
    }
  };

  const contentWithBreaks = (chapter.content || '').replace(/\n/g, '<div style="height: 0.75em;"></div>');
  const cleanContent = sanitizeHtml(contentWithBreaks, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'div', 'span', 'br', 'hr' ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    'img': ['src', 'alt', 'width', 'height', 'title'],
    'div': ['class', 'style', 'id'],
    'span': ['class', 'style'],
    'p': ['class', 'style']
  },
  
  allowedSchemes: [ 'http', 'https', 'data', 'mailto' ]
  });

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
                { label: novel.title, link: `/${novelSlug}` }, 
                { label: chapter.title, link: null }
              ]} 
            />
            <div className={styles.chapterHeader}>
              <h1>{novel.title}</h1>
              <h2>{chapter.title}</h2>
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                  Estimasi waktu baca: {readingTime} menit
              </span>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.content}>
               {parse(cleanContent, options)}
            </div>

            <div className={styles.navigation}>
              <button 
                onClick={() => {
                  if (prevChapter) router.push(`/${novelSlug}/${prevChapter.chapter_slug}`);
                  else router.push(`/${novelSlug}`);
                }}
              >
                {prevChapter ? '« Chapter Sebelumnya' : '« Sinopsis'}
              </button>

              <button 
                onClick={() => {
                  if (nextChapter) {
                    router.push(`/${novelSlug}/${nextChapter.chapter_slug}`);
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
                {nextChapter ? 'Chapter Selanjutnya »' : 'Novel Selanjutnya »'}
              </button>
            </div>
            <CommentSection 
              novelSlug={novelSlug} 
              chapterSlug={chapterSlug} 
            />
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