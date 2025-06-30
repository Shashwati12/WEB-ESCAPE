import express from 'express';
import { getOrCreateProgress, resetProgress} from '../controllers/gameController.js';
import isAuthenticated  from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/progress', isAuthenticated, getOrCreateProgress);
router.post('/progress/reset', isAuthenticated, resetProgress);

export default router;
