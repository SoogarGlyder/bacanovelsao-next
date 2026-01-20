'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import parse, { domToReact } from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import { FaMinus, FaPlus, FaRedoAlt } from 'react-icons/fa';
import { useFontSize } from '@/contexts/FontSizeContext'; 
import styles from './BlogPage.module.css';
import Breadcrumbs from '@/components/Breadcrumbs';

// --- IMPORT KATEX ---
import 'katex/dist/katex.min.css'; 
import { BlockMath, InlineMath } from 'react-katex';

// --- IMPORT COMMENT SECTION ---
import CommentSection from '@/components/CommentSection';

export default function BlogClient({ article }) {
  const { fontSize, changeFontSize, resetFontSize } = useFontSize();
  const [isListVisible, setIsListVisible] = useState(false);
  const [headings, setHeadings] = useState([]);
  
  // State untuk Artikel Terkait
  const [relatedArticles, setRelatedArticles] = useState([]);

  // 1. Generate TOC
  useEffect(() => {
    if (article?.content) {
      const regex = /<h([2-3])(.*?)>(.*?)<\/h\1>/g;
      const matches = [];
      let match;
      while ((match = regex.exec(article.content)) !== null) {
        const text = match[3].replace(/<[^>]*>/g, '');
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        matches.push({ level: match[1], text: text, id: id });
      }
      setHeadings(matches);
    }
  }, [article]);

  // 2. Fetch Related Articles (Simple Logic: Fetch Latest 3 excluding current)
  useEffect(() => {
    const fetchRelated = async () => {
        try {
            // Kita panggil API artikel (asumsi endpoint GET /api/articles mengembalikan array artikel)
            const res = await fetch('/api/articles');
            const data = await res.json();
            
            if (res.ok && Array.isArray(data)) {
                // Filter agar artikel yang sedang dibaca tidak muncul
                const filtered = data
                    .filter(item => item.slug !== article.slug)
                    .slice(0, 3); // Ambil 3 saja
                setRelatedArticles(filtered);
            }
        } catch (error) {
            console.error("Gagal memuat artikel terkait:", error);
        }
    };

    if (article?.slug) {
        fetchRelated();
    }
  }, [article]);

  // 3. Logic Sidebar Mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 767) {
        setIsListVisible(true);
      }
    }
    const handleResize = () => {
      setIsListVisible(window.innerWidth > 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!article) return null;

  // 4. Options Parser
  const options = {
    replace: (domNode) => {
      // Math Block
      if (domNode.attribs && domNode.attribs.class === 'math-block') {
        const mathExpression = domNode.attribs['data-math'];
        return (
          <div style={{ overflowX: 'auto', margin: '15px 0', textAlign: 'center', padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
            <BlockMath math={mathExpression} />
          </div>
        );
      }
      // Math Inline
      if (domNode.attribs && domNode.attribs.class === 'math-inline') {
        const mathExpression = domNode.attribs['data-math'];
        return (
           <span className="math-inline-wrapper" style={{ margin: '0 2px' }}>
              <InlineMath math={mathExpression} />
           </span>
        );
      }
      // Gambar
      if (domNode.type === 'tag' && domNode.name === 'img') {
        const { src, alt } = domNode.attribs;
        return (
          <div className={styles.optimizedImageWrapper}>
            <Image 
              src={src}
              alt={alt || 'Ilustrasi Blog'}
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
      // Heading ID
      if (domNode.type === 'tag' && ['h2', 'h3'].includes(domNode.name)) {
         const text = domToReact(domNode.children).toString();
         const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
         if (domNode.name === 'h2') return <h2 id={id}>{domToReact(domNode.children)}</h2>;
         if (domNode.name === 'h3') return <h3 id={id}>{domToReact(domNode.children)}</h3>;
      }
    }
  };
  
  const contentWithBreaks = (article.content || '').replace(/\n/g, '<div style="height: 0.75em;"></div>');
  
  const cleanContent = sanitizeHtml(contentWithBreaks, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 
        'img', 'div', 'span', 'br', 'hr', 'h2', 'h3', 'blockquote', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'em' 
    ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'width', 'height', 'title'],
        'h2': ['id'], 'h3': ['id'],
        'div': ['class', 'style', 'data-math'], 
        'span': ['class', 'style', 'data-math']
    }
  });

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 105; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      if (window.innerWidth <= 767) setIsListVisible(false);
    }
  };

  return (
    <div className={styles.holyGrailLayout}>
       {/* SIDEBAR KIRI */}
       <aside className={styles.leftSidebar}>
          <button
            className={styles.mobileToggle}
            onClick={() => setIsListVisible(!isListVisible)}>
            Daftar Isi {isListVisible ? '▴' : '▾'}
          </button>
          <h2 className={styles.leftSidebarTitle}>Daftar Isi</h2>
          
          {isListVisible && (
              <ul className={styles.chapterList}>
                {headings.length > 0 ? (
                  headings.map((head, index) => (
                    <li key={index} style={{ paddingLeft: head.level === '3' ? '0' : '0' }}>
                      <div onClick={() => scrollToHeading(head.id)} className={styles.chapterLink} title={head.text}>
                        <span>{head.text}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li style={{ padding: '10px', color: '#888', fontStyle: 'italic' }}>Tidak ada subjudul</li>
                )}
              </ul>
          )}
      </aside>

      {/* KONTEN TENGAH */}
      <main className={styles.mainContent}>
            <Breadcrumbs 
              items={[{ label: 'Blog', link: '/blog' }, { label: article.title, link: null }]} 
            />
            <div className={styles.chapterHeader}>
              <h1>{article.title}</h1>
              {article.subtitle && <h2>{article.subtitle}</h2>}
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                {article.date} | {article.author || 'Admin'}
              </span>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.content} style={{ fontSize: `${fontSize}px` }}>
               {parse(cleanContent, options)}
            </div>

            {/* --- ARTIKEL TERKAIT (DITAMBAHKAN DI SINI) --- */}
            {relatedArticles.length > 0 && (
                <div className={styles.relatedSection}>
                    <h3 className={styles.relatedTitle}>Artikel Lainnya</h3>
                    <div className={styles.relatedGrid}>
                        {relatedArticles.map((rel) => (
                            <Link href={`/blog/${rel.slug}`} key={rel._id} className={styles.relatedCard}>
                                <div className={styles.relatedImageWrapper}>
                                    {/* Gunakan image dummy jika tidak ada gambar */}
                                    <Image 
                                        src={rel.image || '/images/no-image.jpg'} 
                                        alt={rel.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.relatedContent}>
                                    <div className={styles.relatedCardTitle}>{rel.title}</div>
                                    <div className={styles.relatedCardDate}>{rel.date}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* --- BAGIAN KOMENTAR --- */}
            <div style={{ marginTop: '40px', borderTop: '1px solid var(--input-border)', paddingTop: '20px' }}>
                <CommentSection 
                    novelSlug="blog" 
                    chapterSlug={article.slug} 
                />
            </div>
      </main>

      {/* SIDEBAR KANAN */}
      <aside className={styles.rightSidebar}>
        <div className={styles.rightContainer}>
            <h3 className={styles.sidebarTitle}>Ukuran Font</h3>
            <div className={styles.fontControlButtons}>
                <button onClick={() => changeFontSize(-1)} className={styles.fontBtn} title="Kecilkan"><FaMinus /></button>
                <button onClick={resetFontSize} className={styles.fontBtn} title="Reset"><FaRedoAlt /></button>
                <button onClick={() => changeFontSize(1)} className={styles.fontBtn} title="Besarkan"><FaPlus /></button>
            </div>
        </div>
        <div className={styles.rightContainer}>
          <h3 className={styles.sidebarTitle}>Dukung Kami Yuk!</h3>
          <a href="https://saweria.co/SoogarGlyder" target="_blank" rel="noreferrer">
            <img className={styles.saweria} src="/saweria.png" alt="QR Code Saweria"/>
          </a>
        </div>
      </aside>
    </div>
  );
}