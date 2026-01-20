'use client';

import React, { useState, useEffect } from 'react';

export default function ArticleForm({ articleToEdit, onSaveSuccess, styles }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    author: 'Admin',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    image: '',
    tags: '',
    excerpt: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Isi form jika mode Edit
  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        title: articleToEdit.title || '',
        slug: articleToEdit.slug || '',
        subtitle: articleToEdit.subtitle || '',
        author: articleToEdit.author || 'Admin',
        date: articleToEdit.date || '',
        image: articleToEdit.image || '',
        tags: Array.isArray(articleToEdit.tags) ? articleToEdit.tags.join(', ') : (articleToEdit.tags || ''),
        excerpt: articleToEdit.excerpt || '',
        content: articleToEdit.content || ''
      });
      setMessage(null);
    } else {
      setFormData({
        title: '',
        slug: '',
        subtitle: '',
        author: 'Admin',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        image: '',
        tags: '',
        excerpt: '',
        content: ''
      });
    }
  }, [articleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-slug generator (hanya saat buat baru)
    if (name === 'title' && !articleToEdit) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    try {
      let url = '/api/articles';
      let method = 'POST';

      if (articleToEdit) {
        url = `/api/articles/${articleToEdit._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: articleToEdit ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!' });
        
        if (!articleToEdit) {
            setFormData({
                title: '', slug: '', subtitle: '', author: 'Admin',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                image: '', tags: '', excerpt: '', content: ''
            });
        }
        
        if (onSaveSuccess) onSaveSuccess();

      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan artikel.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.novelForm}>
      {message && (
        <div className={message.type === 'error' ? styles.error : styles.success}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Judul Artikel</label>
        <input 
            type="text" name="title" required 
            value={formData.title} onChange={handleChange} 
        />

        <label>Slug (URL Unik)</label>
        <input 
            type="text" name="slug" required 
            value={formData.slug} onChange={handleChange}
            style={{ backgroundColor: 'var(--input-bg)' }}
        />

        <label>Sub Judul (Opsional)</label>
        <input 
            type="text" name="subtitle" 
            value={formData.subtitle} onChange={handleChange} 
            placeholder="Contoh: Analisis Mendalam Floor 75"
        />

        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label>Penulis</label>
                <input 
                    type="text" name="author" 
                    value={formData.author} onChange={handleChange} 
                />
            </div>
            <div style={{ flex: 1 }}>
                <label>Tanggal</label>
                <input 
                    type="text" name="date" 
                    value={formData.date} onChange={handleChange} 
                />
            </div>
        </div>

        <label>URL Gambar (Copy dari Postimages)</label>
        <input 
            type="text" name="image" 
            value={formData.image} onChange={handleChange} 
            placeholder="https://i.postimg.cc/..../gambar.jpg"
        />
        {formData.image && (
            <div style={{ margin: '10px 0' }}>
                <img src={formData.image} alt="Preview" style={{ height: '80px', borderRadius: '4px' }} />
            </div>
        )}

        <label>Tags (Pisahkan dengan koma)</label>
        <input 
            type="text" name="tags" 
            value={formData.tags} onChange={handleChange} 
            placeholder="Anime, SAO, Review"
        />

        <label>Excerpt (Ringkasan Singkat)</label>
        <textarea 
            name="excerpt" rows="3" required
            value={formData.excerpt} onChange={handleChange} 
        />

        <label>Konten Artikel (HTML allowed)</label>
        <p style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>
           Tips: Gunakan class <code>math-inline</code> untuk rumus.
        </p>
        <textarea 
            name="content" rows="15" required
            value={formData.content} onChange={handleChange} 
            style={{ fontFamily: 'monospace', lineHeight: '1.4' }}
        />

        <div style={{ marginTop: '20px' }}>
            <button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : (articleToEdit ? 'Update Artikel' : 'Publish Artikel')}
            </button>
            {articleToEdit && (
                <button 
                    type="button" 
                    onClick={() => onSaveSuccess()} 
                    style={{ marginLeft: '10px', backgroundColor: '#666' }}
                >
                    Batal Edit
                </button>
            )}
        </div>
      </form>
    </div>
  );
}