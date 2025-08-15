export function chunkText(text, size = 180, overlap = 40) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const piece = words.slice(i, i + size).join(' ');
    chunks.push(piece);
    i += Math.max(1, size - overlap);
  }
  return chunks.length ? chunks : [text];
}
