import Chunk from '../models/Chunk.js';
import { embedTexts, generateAnswer } from '../services/embeddingService.js';

export async function search(req, res) {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ ok: false, error: 'query required' });

    // 1. Fetch candidate chunks from DB
    const candidateChunks = await Chunk.find({ text: { $regex: query, $options: 'i' } }).limit(10);
    const contexts = candidateChunks.map(c => c.text);
    const citations = candidateChunks.map(c => ({
      title: c.title,
      year: c.year,
      url: c.url || '',
      openalexId: c.chunkId
    }));

    // 2. Generate embeddings
    const embeddings = await embedTexts(contexts);

    // 3. Generate answer
    const answer = await generateAnswer({ query, contexts, citations });

    res.json({ answer, embeddings, contexts, citations });
  } catch (err) {
    console.error("Search controller error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
}