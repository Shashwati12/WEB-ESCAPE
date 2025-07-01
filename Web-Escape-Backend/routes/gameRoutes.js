import express from 'express';
import { getOrCreateProgress, resetProgress, updateTime} from '../controllers/gameController.js';
import isAuthenticated  from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/progress', isAuthenticated, getOrCreateProgress);
router.post('/progress/reset', isAuthenticated, resetProgress);
router.patch('/progress/time',isAuthenticated, updateTime)

export default router;
