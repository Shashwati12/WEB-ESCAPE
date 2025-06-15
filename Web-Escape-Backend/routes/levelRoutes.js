import express from 'express';
import { getLevelData, submitAnswer } from '../controllers/levelController.js';
import isAuthenticated  from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Get a level's assigned question variant for the user
router.get('/:level', isAuthenticated , getLevelData);

// POST: Submit an answer for a specific level
router.post('/:level/submit', isAuthenticated , submitAnswer);

export default router;
