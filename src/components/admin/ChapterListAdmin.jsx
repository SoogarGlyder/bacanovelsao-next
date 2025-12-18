import React, { useState, useEffect, useMemo } from 'react';

function ChapterListAdmin({ onEditChapter, refreshToggle, styles }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. STATE UNTUK SEARCH & SORT
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'chapter_number', direction: 'descending' });

  // 2. Fetch Data dari API
  useEffect(() => {
    const fetchAllChapters = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/chapters/all'); 
            const data = await res.json();
            if (Array.isArray(data)) setChapters(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchAllChapters();
  }, [refreshToggle]); 

  const handleDelete = async (chapterId, title) => {
    if (!window.confirm(`Hapus chapter "${title}"?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
      setChapters(prev => prev.filter(c => c._id !== chapterId));
      alert(`Chapter dihapus.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. LOGIKA SORTING (Klik Header)
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 4. LOGIKA GABUNGAN (SEARCH + SORT) - INI BAGIAN PENTINGNYA
  const processedChapters = useMemo(() => {
    let items = [...chapters];

    // -- A. Filter Search --
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      items = items.filter(item => 
        (item.title || '').toLowerCase().includes(lowerSearch) ||           // Cari Judul Chapter
        (item.novel?.title || '').toLowerCase().includes(lowerSearch) ||    // Cari Judul Novel
        String(item.chapter_number).includes(lowerSearch)                   // Cari Nomor Chapter
      );
    }

    // -- B. Sorting --
    if (sortConfig.key) {
      items.sort((a, b) => {
        let valA, valB;

        // Penanganan khusus untuk kolom Novel Title (karena object nested)
        if (sortConfig.key === 'novel_title') {
            valA = a.novel?.title || '';
            valB = b.novel?.title || '';
        } else {
            valA = a[sortConfig.key];
            valB = b[sortConfig.key];
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [chapters, searchTerm, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  if (loading && chapters.length === 0) return <p>Memuat data Chapter...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.tableWrapper}>
        {/* === BAGIAN SEARCH BAR ADA DI SINI === */}
        <div style={{ alignItems: 'center', marginBottom: '15px' }}>
             <input 
                type="text" 
                placeholder="Cari Judul Chapter / Novel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                    padding: '8px', 
                    width: '300px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px' 
                }}
            />
        </div>
        
        <table className={styles.novelTable}>
        <thead>
            <tr>
                <th onClick={() => requestSort('chapter_number')} style={{cursor:'pointer', width:'80px'}}>
                    No {getSortIcon('chapter_number')}
                </th>
                <th onClick={() => requestSort('title')} style={{cursor:'pointer'}}>
                    Judul Chapter {getSortIcon('title')}
                </th>
                <th onClick={() => requestSort('novel_title')} style={{cursor:'pointer'}}>
                    Novel {getSortIcon('novel_title')}
                </th>
                <th>Slug</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            {processedChapters.length > 0 ? (
                processedChapters.map((chapter) => (
                    <tr key={chapter._id}>
                        <td>{chapter.chapter_number}</td> 
                        <td>{chapter.title}</td>
                        <td>{chapter.novel?.title || <span style={{color:'red'}}>N/A</span>}</td> 
                        <td>{chapter.chapter_slug}</td>
                        <td>
                            <button 
                                onClick={() => onEditChapter(chapter)} 
                                style={{ marginRight: '5px', backgroundColor: '#ffd700', color: '#333', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' }}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(chapter._id, chapter.title)}
                                style={{ backgroundColor: '#ff6347', color: 'white', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer' }}
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan="5" style={{textAlign:'center'}}>Tidak ada data chapter yang cocok.</td></tr>
            )}
        </tbody>
        </table>
    </div>
  );
}

export default ChapterListAdmin;