import express from 'express';
import { getStatistics } from '../controllers/statisticsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getStatistics);

export default router;

