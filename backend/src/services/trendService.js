import KMeans from 'ml-kmeans';

/**
 * Compute topic trends from chunk embeddings.
 * chunks = [{ year, vector }]
 */
export function topicTrends({ chunks, k = 12 }) {
  if (!chunks.length) return [];

  // Filter only valid vectors
  const validChunks = chunks.filter(c => c.vector && c.vector.length > 0);
  if (!validChunks.length) return [];

  const vectors = validChunks.map(c => c.vector);

  // Run KMeans clustering
  const km = KMeans(vectors, k);

  const clusters = Array.from({ length: k }, () => ({ yearly: {}, members: [] }));

  validChunks.forEach((c, i) => {
    const cid = km.clusters[i];
    clusters[cid].members.push(i);
    const y = c.year || 0;
    clusters[cid].yearly[y] = (clusters[cid].yearly[y] || 0) + 1;
  });

  // Compute slope to determine trend
  function slope(series) {
    const xs = Object.keys(series).map(Number).sort((a, b) => a - b);
    if (xs.length < 2) return 0;
    const n = xs.length;
    const xbar = xs.reduce((a, b) => a + b, 0) / n;
    const ybar = xs.reduce((a, b) => a + series[b], 0) / n;
    let num = 0,
      den = 0;
    for (const x of xs) {
      num += (x - xbar) * (series[x] - ybar);
      den += (x - xbar) ** 2;
    }
    return den ? num / den : 0;
  }

  return clusters.map((c, idx) => {
    const s = slope(c.yearly);
    return {
      cluster: idx,
      slope: s,
      trend: s > 0 ? "rising" : s < 0 ? "declining" : "stable",
      yearly: c.yearly
    };
  });
}