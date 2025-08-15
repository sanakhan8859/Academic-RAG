import Paper from '../models/Paper.js';
export async function listSeminal(req, res) {
  try {
    const limit = Number(req.query.limit||20);
    const rows = await Paper.find({}).sort({ seminalScore: -1 }).limit(limit);
    res.json({ ok:true, items: rows });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
}
