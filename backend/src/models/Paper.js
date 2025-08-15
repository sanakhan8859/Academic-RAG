import mongoose from 'mongoose';
const PaperSchema = new mongoose.Schema({
  openalexId: { type: String, index: true, unique: true },
  title: String,
  abstract: String,
  year: Number,
  authors: [String],
  venue: String,
  concepts: [{ name: String, level: Number }],
  references: [String],
  cited_by_count: Number,
  doi: String,
  url: String,
  seminalScore: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Paper', PaperSchema);
