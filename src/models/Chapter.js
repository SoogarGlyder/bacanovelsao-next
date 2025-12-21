import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
  },
  chapter_number: {
    type: Number,
    required: true,
  },
  chapter_slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- FUNGSI SLUG HELPER ---
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// --- SOLUSI FIX: ASYNC TANPA NEXT ---
// Perhatikan: Tidak ada tulisan 'next' di dalam kurung function()
ChapterSchema.pre('save', async function() { 
  
  // 1. Jika slug kosong, buat dari title
  if (!this.chapter_slug) {
    this.chapter_slug = createSlug(this.title);
  } 
  // 2. Jika slug diedit manual, rapikan formatnya
  else if (this.isModified('chapter_slug')) {
    this.chapter_slug = createSlug(this.chapter_slug);
  }

  // TIDAK ADA next() DISINI. 
  // Karena pakai async, Mongoose otomatis tahu kapan selesai.
});

// Mencegah Re-compile Error di Next.js
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);

export default Chapter;