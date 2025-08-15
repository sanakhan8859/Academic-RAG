import mongoose from 'mongoose';
const ChunkSchema = new mongoose.Schema({
  chunkId: { type: String, index: true, unique: true },
  docId: { type: String, index: true },
  title: String,
  year: Number,
  conceptsTop: [String],
  text: String
}, { timestamps: true });
export default mongoose.model('Chunk', ChunkSchema);
