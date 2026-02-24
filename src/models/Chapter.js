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

function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}


ChapterSchema.pre('save', async function() { 
  
  if (!this.chapter_slug) {
    this.chapter_slug = createSlug(this.title);
  } 
  else if (this.isModified('chapter_slug')) {
    this.chapter_slug = createSlug(this.chapter_slug);
  }
});

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);

export default Chapter;