import express from 'express';
import {
  getEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluation,
  updateStatut,
} from '../controllers/evaluationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getEvaluations);
router.get('/:candidatureId', getEvaluation);
router.post('/', createEvaluation);
router.put('/:id', updateEvaluation);
router.patch('/:id/statut', updateStatut);

export default router;

