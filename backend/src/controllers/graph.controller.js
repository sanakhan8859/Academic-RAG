import Paper from '../models/Paper.js';
import { buildGraph, egoGraph } from '../services/graphService.js';

export async function ego(req, res) {
  try {
    let { id, radius = 1 } = req.query;

    // If no ID provided, pick the first paper as default
    if (!id) {
      const firstPaper = await Paper.findOne({});
      if (!firstPaper) return res.status(404).json({ ok:false, error:'No papers in DB' });
      id = firstPaper.openalexId;
    }

    const papers = await Paper.find({});
    const g = buildGraph(papers);
    if (!g.hasNode(id)) return res.status(404).json({ ok:false, error:'paper not found in graph' });

    const eg = egoGraph(g, id, Number(radius)||1);
    res.json({ ok:true, graph: eg });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: e.message });
  }
}