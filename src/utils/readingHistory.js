const HISTORY_KEY = 'bacanovelsao_history';

export const saveReadingHistory = (novelSlug, chapterSlug, chapterTitle, chapterNumber) => {
  // Pengecekan: Pastikan kode ini berjalan di browser (bukan server)
  if (typeof window === 'undefined') return;

  try {
    const currentHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');

    currentHistory[novelSlug] = {
      chapterSlug,
      chapterTitle,
      chapterNumber,
      lastReadAt: new Date().toISOString(),
    };

    localStorage.setItem(HISTORY_KEY, JSON.stringify(currentHistory));
  } catch (error) {
    console.error("Gagal menyimpan history baca:", error);
  }
};

export const getReadingHistory = (novelSlug) => {
  // Pengecekan: Pastikan kode ini berjalan di browser
  if (typeof window === 'undefined') return null;

  try {
    const currentHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    return currentHistory[novelSlug] || null;
  } catch (error) {
    return null;
  }
};