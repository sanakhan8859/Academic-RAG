
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { connectMongo } from './config/mongo.js';
import ingestRoutes from './routes/ingest.routes.js';
import searchRoutes from './routes/search.routes.js';
import graphRoutes from './routes/graph.routes.js';
import seminalRoutes from './routes/seminal.routes.js';
import trendsRoutes from './routes/trends.routes.js';
import dotenv from "dotenv";




const app = express();
const logger = pino({ name: 'backend' });
// app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));

dotenv.config();

app.get('/', (_,res)=>res.json({ ok:true, service:'academic-rag-citation-backend' }));
app.use('/api/ingest', ingestRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/seminal', seminalRoutes);
app.use('/api/trends', trendsRoutes);

const PORT = process.env.PORT || 8080;
connectMongo(process.env.MONGO_URI).then(()=>{
  app.listen(PORT, ()=> console.log(`✅ Server on :${PORT}`));
});
