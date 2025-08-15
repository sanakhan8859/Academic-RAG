import Paper from '../models/Paper.js';
import Chunk from '../models/Chunk.js';
import { fetchOpenAlex } from '../services/openalexService.js';
import { chunkText } from '../utils/chunkText.js';
import { embedTexts } from '../services/embeddingService.js';
import { upsertVectors } from '../services/vectorService.js';
import { buildGraph } from '../services/graphService.js';

export async function ingest(req, res) {
  try {
    const query = req.body.query || process.env.OPENALEX_QUERY || 'transformer clinical nlp';
    const maxPages = Number(process.env.OPENALEX_MAX_PAGES||2);
    const raw = await fetchOpenAlex({ query, maxPages });

    const bulkOps = raw.map(p => ({
      updateOne: { filter: { openalexId: p.openalexId }, update: { $set: p }, upsert: true }
    }));
    if (bulkOps.length) await Paper.bulkWrite(bulkOps);

    const papers = await Paper.find({ openalexId: { $in: raw.map(r=>r.openalexId) } });

    const allChunks = [];
    for (const p of papers) {
      const chunks = chunkText(p.abstract, 180, 40);
      chunks.forEach((text, j) => {
        allChunks.push({
          chunkId: `${p.openalexId}#${j}`,
          docId: p.openalexId,
          title: p.title,
          year: p.year,
          conceptsTop: (p.concepts||[]).filter(c=>c.level===0).map(c=>c.name),
          text
        });
      });
    }
    if (allChunks.length) {
      const ops = allChunks.map(c=>({ updateOne: { filter: { chunkId: c.chunkId }, update: { $set: c }, upsert: true } }));
      await Chunk.bulkWrite(ops);

      const embs = await embedTexts(allChunks.map(c=>c.text));
      const items = allChunks.map((c, i) => ({
        id: c.chunkId,
        values: embs[i],
        metadata: { docId: c.docId, title: c.title, year: c.year, conceptsTop: c.conceptsTop, chunkId: c.chunkId }
      }));
      await upsertVectors(items);
    }

    const allPapers = await Paper.find({});
    const g = buildGraph(allPapers);
    const updates = [];
    g.forEachNode((id, attrs) => {
      updates.push({ updateOne: { filter: { openalexId: id }, update: { $set: { seminalScore: attrs.seminalScore||0 } } } });
    });
    if (updates.length) await Paper.bulkWrite(updates);

    res.json({ ok: true, papers: raw.length, chunks: allChunks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
