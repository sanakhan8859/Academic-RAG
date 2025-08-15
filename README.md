# Academic RAG with Citation Network (MERN)

MERN app that ingests OpenAlex papers, builds a citation graph (PageRank + HITS + temporal boost), detects topic trends, and answers queries with RAG + inline citations.

Link : https://academic-rag-front.onrender.com/

## Quickstart

### Backend
```bash
cd backend
cp .env.example .env   # fill: MONGO_URI, OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX
npm i
npm run dev
# First run: ingest some domain data
curl -X POST http://localhost:8080/api/ingest -H 'Content-Type: application/json' -d '{"query":"transformer clinical nlp"}'
```

### Frontend
```bash
cd ../frontend
npm i
npm run dev
# If backend runs elsewhere, set VITE_API_BASE in .env or run:
# VITE_API_BASE=http://localhost:8080 npm run dev
```

## API
- POST `/api/ingest` { query }
- POST `/api/search` { q, k }
- GET  `/api/graph/ego?id=openalex:W...&radius=1`
- GET  `/api/seminal?limit=20`
- GET  `/api/trends`

## Notes
- Vector DB: Pinecone (namespace by DOMAIN_SLUG). Paper & chunk metadata in MongoDB.
- Seminal score = 0.45*PageRank + 0.35*HITS(authority) + 0.20*temporal boost.
- Trends: k-means on chunk embeddings (sample) + yearly slope.

## Deploy
- Backend: Render/Railway (add env vars; connect Mongo Atlas)
- Frontend: Netlify/Vercel (set VITE_API_BASE)
