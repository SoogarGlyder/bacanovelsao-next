import React, { useState, useEffect } from 'react';

const seriesOptions = [
  { id: 'main', name: 'Main (Utama)' },
  { id: 'progressive', name: 'Progressive' },
  { id: 'ggo', name: 'Gun Gale Online' },
  { id: 'clover', name: "Clover's Regret" },
  { id: 'anthology', name: 'Anthology' },
  { id: 'gourmet', name: 'Gourmet Seekers' },
  { id: 'mystery', name: 'Mystery Labyrinth' },
  { id: 'alternative', name: 'Alternative' },
];

const initialFormState = {
  title: '',
  serie: 'main', 
  synopsis: '',
  cover_image: '',
  novel_slug: '',
  affiliate_title: '',
  affiliate_link: '',
  affiliate_image: ''
};

function NovelForm({ novelToEdit, onSaveSuccess, styles }) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const isEditing = !!novelToEdit;

  useEffect(() => {
    if (novelToEdit) {
      setFormData({
        title: novelToEdit.title || '',
        serie: novelToEdit.serie || 'main',
        synopsis: novelToEdit.synopsis || '',
        cover_image: novelToEdit.cover_image || '',
        novel_slug: novelToEdit.novel_slug || '',
        affiliate_title: novelToEdit.affiliate_title || '',
        affiliate_link: novelToEdit.affiliate_link || '',
        affiliate_image: novelToEdit.affiliate_image || '',
        _id: novelToEdit._id
      });
    } else {
      setFormData(initialFormState);
    }
  }, [novelToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
        ? `/api/novels/${formData._id}`
        : '/api/novels';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Gagal menyimpan novel');
      }

      setSuccess(`Novel berhasil di${isEditing ? 'perbarui' : 'buat'}!`);
      
      if (!isEditing) {
        setFormData(initialFormState);
      }
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.novelForm}>
      {error && <p className={styles.error} style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      {success && <p className={styles.success} style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

      <label htmlFor="title">Judul Novel</label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="Contoh: Sword Art Online Vol 1"
      />

      <label htmlFor="serie">Seri</label>
      <select
        id="serie"
        name="serie"
        value={formData.serie}
        onChange={handleChange}
        required
      >
        {seriesOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      
      <label htmlFor="novel_slug">Slug URL (Unik)</label>
      <input
        id="novel_slug"
        name="novel_slug"
        type="text"
        value={formData.novel_slug}
        onChange={handleChange}
        required
        placeholder="contoh: sao-vol-1-aincrad (tanpa spasi)"
        style={{ marginBottom: '5px' }}
      />
      <small style={{ display:'block', marginBottom:'15px', color:'#666' }}>
        Gunakan huruf kecil dan tanda strip (-). Jangan pakai spasi.
      </small>

      <label htmlFor="cover_image">URL Cover Image</label>
      <input
        id="cover_image"
        name="cover_image"
        type="text"
        value={formData.cover_image}
        onChange={handleChange}
        placeholder="https://..."
      />

      <label htmlFor="synopsis">Sinopsis</label>
      <textarea
        id="synopsis"
        name="synopsis"
        value={formData.synopsis}
        onChange={handleChange}
        rows={6}
        placeholder="Tulis sinopsis singkat..."
      />

      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--input-border)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)' }}>Data Afiliasi (Opsional)</h4>
        
        <label htmlFor="affiliate_title" style={{ fontSize: '0.9rem' }}>Judul Produk Afiliasi</label>
        <input
          id="affiliate_title"
          name="affiliate_title"
          type="text"
          value={formData.affiliate_title}
          onChange={handleChange}
          placeholder="Contoh: Light Novel SAO Vol 1 Fisik"
        />

        <label htmlFor="affiliate_link" style={{ fontSize: '0.9rem' }}>Link Afiliasi (Shopee/Tokopedia)</label>
        <input
          id="affiliate_link"
          name="affiliate_link"
          type="text"
          value={formData.affiliate_link}
          onChange={handleChange}
          placeholder="https://s.shopee.co.id/..."
        />

        <label htmlFor="affiliate_image" style={{ fontSize: '0.9rem' }}>URL Gambar Produk</label>
        <input
          id="affiliate_image"
          name="affiliate_image"
          type="text"
          value={formData.affiliate_image}
          onChange={handleChange}
          placeholder="URL gambar produk..."
        />
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Memproses...' : (isEditing ? 'Update Novel' : 'Simpan Novel')}
      </button>
    </form>
  );
}

export default NovelForm;