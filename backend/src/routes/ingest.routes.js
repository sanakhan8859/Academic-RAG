import { Router } from 'express';
import { ingest } from '../controllers/ingest.controller.js';
const r = Router();
r.post('/', ingest);
export default r;
