'use client';

import React, { useState, useEffect } from 'react'; 
import styles from './admin.module.css'; 
import NovelListAdmin from '@/components/admin/NovelListAdmin'; 
import NovelForm from '@/components/admin/NovelForm'; 
import ChapterListAdmin from '@/components/admin/ChapterListAdmin';
import ChapterForm from '@/components/admin/ChapterForm';
import CommentListAdmin from '@/components/admin/CommentListAdmin';

export default function AdminDashboard() {
  const [novelToEdit, setNovelToEdit] = useState(null); 
  const [chapterToEdit, setChapterToEdit] = useState(null);
  const [refreshList, setRefreshList] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('novels');

  useEffect(() => {
    const checkResize = () => setIsMobile(window.innerWidth < 768);
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  const handleSaveSuccess = () => {
    setNovelToEdit(null); 
    setChapterToEdit(null);
    setRefreshList(prev => !prev); 
  };

  const handleEditNovel = (novel) => {
    setChapterToEdit(null);
    const form = document.getElementById('edit-novel-form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
    setNovelToEdit(novel);
  };
  
  const handleEditChapter = (chapter) => {
    setNovelToEdit(null);
    const form = document.getElementById('edit-chapter-form');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
    setChapterToEdit(chapter);
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
      <h1>Dashboard Administrasi Novel (Local)</h1>
      
      <div className={styles.adminMenu}>
        <h2>Kelola Data</h2>
        <ul>
          <li>
            <a href="#kelola-novel" onClick={(e) => { 
              e.preventDefault(); 
              setNovelToEdit(null); 
              setChapterToEdit(null); 
              document.getElementById('kelola-novel').scrollIntoView({behavior:'smooth'}); 
            }}>
              Kelola Novel
            </a>
          </li>
          <li>
            <a href="#kelola-chapter" onClick={(e) => { 
              e.preventDefault(); 
              setNovelToEdit(null); 
              setChapterToEdit(null); 
              document.getElementById('kelola-chapter').scrollIntoView({behavior:'smooth'}); 
            }}>
              Kelola Chapter
            </a>
          </li>
          <li>
            <a href="#kelola-komentar" onClick={(e) => { 
              e.preventDefault(); 
              setNovelToEdit(null); 
              setChapterToEdit(null); 
              document.getElementById('kelola-komentar').scrollIntoView({behavior:'smooth'}); 
            }}>
              Kelola Komentar
            </a>
          </li>
          <li>
            <a href="#buat-novel" onClick={(e) => { 
              e.preventDefault(); 
              setNovelToEdit(null); 
              setChapterToEdit(null); 
              document.getElementById('edit-novel-form').scrollIntoView({behavior:'smooth'}); 
            }}>
              Buat Baru
            </a>
          </li>
        </ul>
      </div>
      
      <section id="edit-novel-form" style={{ marginTop: '30px' }}>
          <h3>{novelToEdit ? 'Edit Novel' : 'Buat Novel Baru'}</h3>
          <NovelForm 
            novelToEdit={novelToEdit}
            onSaveSuccess={handleSaveSuccess}
            styles={styles}
          />
      </section>
      
      <section id="edit-chapter-form" style={{ marginTop: '30px' }}>
          <h3>{chapterToEdit ? 'Edit Chapter' : 'Buat Chapter Baru'}</h3>
          <ChapterForm 
            chapterToEdit={chapterToEdit}
            onSaveSuccess={handleSaveSuccess}
            styles={styles}
          />
      </section>

      <section id="kelola-novel" style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h2>Daftar Novel</h2>
          <NovelListAdmin 
            key={`novel-${listKey}`} 
            onEditNovel={handleEditNovel} 
            styles={styles}
          />
      </section>

      <section id="kelola-chapter" style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h2>Daftar Chapter</h2>
          <ChapterListAdmin 
            key={`chapter-${listKey}`}
            onEditChapter={handleEditChapter} 
            refreshToggle={refreshList}
            styles={styles}
          />
      </section>

      <section id="kelola-komentar" style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px', paddingBottom: '100px' }}>
          <h2>Moderasi Komentar Netizen</h2>
          <p style={{marginBottom: '10px', color: '#666'}}>Hapus komentar yang mengandung spam atau kata kasar.</p>
          <CommentListAdmin 
             styles={styles}
          />
      </section>
      
    </div>
  );
}