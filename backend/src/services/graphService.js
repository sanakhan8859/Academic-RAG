import pkg from 'graphology';
const { Graph } = pkg;
import pagerank from 'graphology-pagerank';
import hits from 'graphology-hits';

function temporalWeight(year, now = new Date().getFullYear(), tau = 4) {
  if (!year) return 1;
  const age = Math.max(0, now - year);
  return Math.exp(-age / tau);
}

export function buildGraph(papers) {
  const g = new Graph({ type: 'directed', allowSelfLoops: false });
  for (const p of papers) {
    if (!g.hasNode(p.openalexId)) g.addNode(p.openalexId, { title: p.title, year: p.year, cites: p.cited_by_count });
  }
  const byId = new Map(papers.map(p => [p.openalexId, p]));
  for (const p of papers) {
    for (const ref of (p.references || [])) {
      if (byId.has(ref) && p.openalexId !== ref && !g.hasEdge(p.openalexId, ref)) {
        g.addEdge(p.openalexId, ref);
      }
    }
  }

  const pr = pagerank(g, { alpha: 0.85 });
  const { authority } = hits(g);
  g.forEachNode((n, attrs) => {
    const tw = temporalWeight(attrs.year);
    const score = 0.45*(pr[n]||0) + 0.35*(authority[n]||0) + 0.20*tw;
    g.setNodeAttribute(n, 'seminalScore', score);
  });

  return g;
}

export function egoGraph(g, center, radius = 1) {
  const nodes = new Set([center]);
  let frontier = new Set([center]);
  for (let r = 0; r < radius; r++) {
    const next = new Set();
    frontier.forEach(n => {
      g.forEachOutNeighbor(n, m => next.add(m));
      g.forEachInNeighbor(n, m => next.add(m));
    });
    next.forEach(n => nodes.add(n));
    frontier = next;
  }
  const edges = [];
  nodes.forEach(u => {
    g.forEachOutEdge(u, (edge, attrs, source, target) => {
      if (nodes.has(source) && nodes.has(target)) edges.push([source, target]);
    });
  });

  return {
    nodes: Array.from(nodes).map(id => ({ id, ...g.getNodeAttributes(id) })),
    edges: edges.map(([source, target]) => ({ source, target }))
  };
}