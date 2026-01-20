'use client';

import React, { useState, useEffect } from 'react'; 
import styles from './admin.module.css'; 
import NovelListAdmin from '@/components/admin/NovelListAdmin'; 
import NovelForm from '@/components/admin/NovelForm'; 
import ChapterListAdmin from '@/components/admin/ChapterListAdmin';
import ChapterForm from '@/components/admin/ChapterForm';
import CommentListAdmin from '@/components/admin/CommentListAdmin';

// Import Komponen Artikel
import ArticleForm from '@/components/admin/ArticleForm';
import ArticleListAdmin from '@/components/admin/ArticleListAdmin';

export default function AdminDashboard() {
  const [novelToEdit, setNovelToEdit] = useState(null); 
  const [chapterToEdit, setChapterToEdit] = useState(null);
  const [articleToEdit, setArticleToEdit] = useState(null); 

  const [refreshList, setRefreshList] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);
  
  // --- STATE BARU UNTUK TOMBOL SCROLL ---
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Cek Mobile
    const checkResize = () => setIsMobile(window.innerWidth < 768);
    checkResize();
    window.addEventListener('resize', checkResize);

    // Cek Posisi Scroll untuk tombol Top
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);

    return () => {
        window.removeEventListener('resize', checkResize);
        window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  // --- Fungsi Go To Top ---
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSaveSuccess = () => {
    setNovelToEdit(null); 
    setChapterToEdit(null);
    setArticleToEdit(null);
    setRefreshList(prev => !prev); 
    // Opsional: Scroll ke atas sedikit setelah save
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditNovel = (novel) => {
    setChapterToEdit(null); setArticleToEdit(null);
    const form = document.getElementById('edit-novel-form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
    setNovelToEdit(novel);
  };
  
  const handleEditChapter = (chapter) => {
    setNovelToEdit(null); setArticleToEdit(null);
    const form = document.getElementById('edit-chapter-form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
    setChapterToEdit(chapter);
  };

  const handleEditArticle = (article) => {
    setNovelToEdit(null); setChapterToEdit(null);
    const form = document.getElementById('edit-article-form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
    setArticleToEdit(article);
  };

  const scrollToSection = (id) => {
     setNovelToEdit(null); setChapterToEdit(null); setArticleToEdit(null);
     const element = document.getElementById(id);
     if(element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const listKey = refreshList ? 'refresh' : 'initial'; 

  if (isMobile) {
    return (
      <div className={styles.adminContainer} style={{ textAlign: 'center', padding: '50px', height: '100vh', alignContent: 'center'}}>
        <h1 style={{color: '#ff6347'}}>Akses Dibatasi</h1>
        <p>Dashboard Administrasi hanya dapat diakses pada layar dengan lebar minimal 769px (Desktop/Tablet besar).</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Dashboard Administrasi (CMS)</h1>
      
      <div className={styles.adminMenu}>
        <h2>Menu Cepat</h2>
        <ul>
          <li><a href="#kelola-novel" onClick={(e) => { e.preventDefault(); scrollToSection('kelola-novel'); }}>List Novel</a></li>
          <li><a href="#kelola-chapter" onClick={(e) => { e.preventDefault(); scrollToSection('kelola-chapter'); }}>List Chapter</a></li>
          <li><a href="#kelola-artikel" onClick={(e) => { e.preventDefault(); scrollToSection('kelola-artikel'); }}>List Artikel</a></li>
          <li><a href="#kelola-komentar" onClick={(e) => { e.preventDefault(); scrollToSection('kelola-komentar'); }}>Komentar</a></li>
          <li style={{ borderLeft: '2px solid #ccc', paddingLeft: '15px' }}>
             <a href="#edit-novel-form" onClick={(e) => { e.preventDefault(); scrollToSection('edit-novel-form'); }}>+ Novel Baru</a>
          </li>
          <li><a href="#edit-chapter-form" onClick={(e) => { e.preventDefault(); scrollToSection('edit-chapter-form'); }}>+ Chapter Baru</a></li>
          <li><a href="#edit-article-form" onClick={(e) => { e.preventDefault(); scrollToSection('edit-article-form'); }}>+ Artikel Baru</a></li>
        </ul>
      </div>
      
      {/* --- FORM SECTIONS --- */}
      
      <section id="edit-novel-form" style={{ marginTop: '40px' }}>
          <h3 style={{ borderLeft: '5px solid var(--primary)', paddingLeft: '10px' }}>
             {novelToEdit ? `Edit Novel: ${novelToEdit.title}` : 'Buat Novel Baru'}
          </h3>
          <NovelForm 
            novelToEdit={novelToEdit}
            onSaveSuccess={handleSaveSuccess}
            styles={styles}
          />
      </section>
      
      <section id="edit-chapter-form" style={{ marginTop: '40px', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
          <h3 style={{ borderLeft: '5px solid #FF9800', paddingLeft: '10px' }}>
             {chapterToEdit ? `Edit Chapter: ${chapterToEdit.title}` : 'Buat Chapter Baru'}
          </h3>
          <ChapterForm 
            chapterToEdit={chapterToEdit}
            onSaveSuccess={handleSaveSuccess}
            styles={styles}
          />
      </section>

      <section id="edit-article-form" style={{ marginTop: '40px', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
          <h3 style={{ borderLeft: '5px solid #4CAF50', paddingLeft: '10px' }}>
             {articleToEdit ? `Edit Artikel: ${articleToEdit.title}` : 'Buat Artikel Baru'}
          </h3>
          <ArticleForm 
            articleToEdit={articleToEdit}
            onSaveSuccess={handleSaveSuccess}
            styles={styles}
          />
      </section>

      {/* --- LIST SECTIONS --- */}

      <section id="kelola-novel" style={{ marginTop: '60px', borderTop: '4px solid #333', paddingTop: '30px' }}>
          <h2>Daftar Novel</h2>
          <NovelListAdmin 
            key={`novel-${listKey}`} 
            onEditNovel={handleEditNovel} 
            styles={styles}
          />
      </section>

      <section id="kelola-chapter" style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h2>Daftar Chapter</h2>
          <ChapterListAdmin 
            key={`chapter-${listKey}`}
            onEditChapter={handleEditChapter} 
            refreshToggle={refreshList}
            styles={styles}
          />
      </section>

      <section id="kelola-artikel" style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h2>Daftar Artikel Blog</h2>
          <ArticleListAdmin 
             key={`article-${listKey}`}
             onEditArticle={handleEditArticle}
             refreshToggle={refreshList}
             styles={styles}
          />
      </section>

      <section id="kelola-komentar" style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px', paddingBottom: '100px' }}>
          <h2>Moderasi Komentar Netizen</h2>
          <p style={{marginBottom: '10px', color: '#666'}}>Hapus komentar yang mengandung spam atau kata kasar.</p>
          <CommentListAdmin 
             styles={styles}
          />
      </section>
      
      {/* --- TOMBOL BACK TO TOP --- */}
      <button 
        className={`${styles.scrollTopBtn} ${showScrollTop ? styles.showScroll : ''}`} 
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
      >
        ▲
      </button>

    </div>
  );
}