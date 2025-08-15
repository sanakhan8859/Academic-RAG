import { Pinecone } from '@pinecone-database/pinecone';
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = process.env.PINECONE_INDEX;
const namespace = process.env.DOMAIN_SLUG || 'default';
function getIndex() { return pc.Index(indexName); }

export async function upsertVectors(items) {
  const index = getIndex();
  await index.namespace(namespace).upsert(items);
}

export async function queryVectors({ vector, topK = 20 }) {
  const index = getIndex();
  const res = await index.namespace(namespace).query({
    vector, topK, includeMetadata: true
  });
  return res.matches || [];
}
