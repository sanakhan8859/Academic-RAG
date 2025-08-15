import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : 'https://openrouter.ai/api/v1'
});

// Generate embeddings using OpenAI (preferred) or fallback to empty array
export async function embedTexts(texts) {
  console.log("Embedding texts:", texts); // <-- add this line

  if (!Array.isArray(texts) || texts.length === 0) return [];

  const input = texts.map(t => (t || '').slice(0, 8000));

  try {
    const res = await client.embeddings.create({
      model: "text-embedding-3-small",
      input
    });

    if (!res.data || !Array.isArray(res.data)) {
      console.error("No data returned from embeddings API:", res);
      return [];
    }

    return res.data.map(d => d.embedding);
  } catch (err) {
    console.error("Embedding API error:", err.response?.data || err.message);
    return [];
  }
}
// Generate answer using OpenRouter (chat) or OpenAI chat
export async function generateAnswer({ query, contexts, citations }) {
  const numbered = (Array.isArray(contexts) ? contexts : []).map((c, i) => `[${i+1}] ${c}`).join('\n');
  const citationList = (Array.isArray(citations) ? citations : []).map((c, i) =>
    `[${i+1}] ${c.title} (${c.year}) — ${c.url || c.doi || c.openalexId}`
  ).join('\n');

  const sys = `You are a scholarly assistant. Answer concisely using only the provided context. Use inline numeric citations like [1], [2]. If unsure, say you don't know.`;
  const user = `Question: ${query}\n\nContext:\n${numbered}\n\nReturn a factual answer with inline citations. After the answer, add a short 'Key Papers' list.`;

  try {
    const { choices } = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    });
    const answer = choices?.[0]?.message?.content || "No answer generated.";
    return `${answer}\n\nKey Papers:\n${citationList}`;
  } catch (err) {
    console.error("Chat API error:", err.response?.data || err.message);
    return "Error: Could not generate a response. Check your API key or usage limits.";
  }
}