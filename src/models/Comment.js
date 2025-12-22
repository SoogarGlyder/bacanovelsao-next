import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  novelSlug: {
    type: String,
    required: true,
    index: true,
  },
  chapterSlug: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
    maxlength: [50, 'Nama maksimal 50 karakter'],
  },
  content: {
    type: String,
    required: [true, 'Komentar wajib diisi'],
    trim: true,
    maxlength: [1000, 'Komentar maksimal 1000 karakter'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);