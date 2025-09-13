import express from 'express';
import { Nosotros } from '../controllers/nosotros.controller.js';
const router = express.Router();
router.get("/", Nosotros);
export default router;