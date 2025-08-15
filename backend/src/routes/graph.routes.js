import { Router } from 'express';
import { ego } from '../controllers/graph.controller.js';
const r = Router();
r.get('/ego', ego);
export default r;
