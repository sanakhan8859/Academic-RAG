// controllers/trends.controller.js
import Chunk from '../models/Chunk.js';
import { topicTrends } from '../services/trendService.js';

export async function trends(req, res) {
  try {
    // Fetch a sample of chunks (or all if you want)
    const chunks = await Chunk.find({ vector: { $exists: true } }).limit(200);

    if (!chunks.length) return res.json({ ok: true, topics: [] });

    const result = topicTrends({ chunks, k: 12 });
    res.json({ ok: true, topics: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
