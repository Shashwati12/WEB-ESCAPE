import express from 'express';
import { getOrCreateProgress, updateProgress} from '../controllers/gameController.js';
import isAuthenticated  from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/progress', isAuthenticated, getOrCreateProgress);
router.put('/progress', isAuthenticated, updateProgress);

export default router;
