import { Router } from 'express';
import { trends } from '../controllers/trends.controller.js';
const r = Router();
r.get('/', trends);
export default r;
