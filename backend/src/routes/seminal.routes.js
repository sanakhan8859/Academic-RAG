import { Router } from 'express';
import { listSeminal } from '../controllers/seminal.controller.js';
const r = Router();
r.get('/', listSeminal);
export default r;
