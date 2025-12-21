import React, { useState, useEffect, useMemo } from 'react';

function NovelListAdmin({ onEditNovel, styles }) {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  useEffect(() => {
    const fetchAllNovels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/novels'); 
            if (!response.ok) throw new Error('Gagal mengambil data novel.');
            const data = await response.json();
            setNovels(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchAllNovels();
  }, [refreshToggle]);

  const handleDelete = async (novelSlug, title) => {
    if (!window.confirm(`Yakin hapus novel "${title}"? SEMUA CHAPTER JUGA HILANG!`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/novels/slug/${novelSlug}`, { method: 'DELETE' });
      if(!res.ok) throw new Error("Gagal hapus");
      setRefreshToggle(prev => !prev); 
      alert(`Novel "${title}" berhasil dihapus.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const processedNovels = useMemo(() => {
    let items = [...novels];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(lowerSearch) ||
        item.serie.toLowerCase().includes(lowerSearch) ||
        item.novel_slug.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [novels, searchTerm, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  if (loading && novels.length === 0) return <p>Memuat data novel...</p>;

  return (
    <div className={styles.tableWrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Cari Judul / Seri..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          onClick={() => setRefreshToggle(prev => !prev)}
          disabled={loading}
          style={{ cursor:'pointer', padding: '8px 15px' }}
        >
          Refresh Data
        </button>
      </div>

      <table className={styles.novelTable}>
        <thead>
          <tr>
            <th onClick={() => requestSort('title')} style={{cursor:'pointer'}}>
              Judul {getSortIcon('title')}
            </th>
            <th onClick={() => requestSort('serie')} style={{cursor:'pointer'}}>
              Seri {getSortIcon('serie')}
            </th>
            <th onClick={() => requestSort('novel_slug')} style={{cursor:'pointer'}}>
              Slug {getSortIcon('novel_slug')}
            </th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {processedNovels.length > 0 ? (
            processedNovels.map((novel) => (
              <tr key={novel._id}>
                <td>{novel.title}</td>
                <td>{novel.serie}</td>
                <td>{novel.novel_slug}</td>
                <td>
                  <button 
                    onClick={() => onEditNovel(novel)}
                    style={{ marginRight: '5px', backgroundColor: '#ffd700', color: '#333', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(novel.novel_slug, novel.title)}
                    style={{ backgroundColor: '#ff6347', color: 'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" style={{textAlign:'center'}}>Tidak ada data ditemukan.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NovelListAdmin;