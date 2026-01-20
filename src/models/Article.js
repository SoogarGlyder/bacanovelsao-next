import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  slug: { type: String, required: true, unique: true },
  author: { type: String, default: 'Admin' },
  date: { type: String, required: true }, // Simpan string seperti "20 Jan 2024"
  image: { type: String }, // URL Gambar
  tags: { type: [String], default: [] }, 
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML Content dari Text Editor
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);