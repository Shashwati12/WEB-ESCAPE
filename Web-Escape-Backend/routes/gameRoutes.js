import express from 'express';
import { getOrCreateProgress, resetProgress, retryLevel, updateTime, useAttempt,getTimer} from '../controllers/gameController.js';
import isAuthenticated  from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/progress', isAuthenticated, getOrCreateProgress);
router.post('/progress/reset', isAuthenticated, resetProgress);
router.patch('/progress/time',isAuthenticated, updateTime);
router.get('/progress/getTime',isAuthenticated,getTimer);
router.post('/level/:level/retry', isAuthenticated, retryLevel);
router.post('/level/:level/attempt-used', isAuthenticated, useAttempt);

export default router;
