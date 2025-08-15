import { Router } from 'express';
import { search } from '../controllers/search.controller.js';
const r = Router();
r.post('/', search);
export default r;
