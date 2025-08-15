// controllers/trends.controller.js
import Chunk from '../models/Chunk.js';
import { topicTrends } from '../services/trendService.js';

export async function trends(req, res) {
  try {
    // Fetch up to 200 chunks
    let chunks = await Chunk.find().limit(200);
console.log(chunks.length);

    if (!chunks.length) return res.json({ ok: true, topics: [] });

    // Check if chunks have vectors
    const hasVectors = chunks.some(c => c.vector && c.vector.length > 0);

    let result;
    if (hasVectors) {
      // Use vector-based KMeans clustering
      result = topicTrends({ chunks, k: 12 });
    } else {
      // Fallback: count conceptsTop
      const topicCount = {};
      chunks.forEach(chunk => {
        (chunk.conceptsTop || []).forEach(concept => {
          topicCount[concept] = (topicCount[concept] || 0) + 1;
        });
      });
      result = Object.entries(topicCount)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => ({ topic, count }));
    }

    res.json({ ok: true, topics: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
