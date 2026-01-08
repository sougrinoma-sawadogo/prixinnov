import express from 'express';
import { generateCandidaturePDF } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Protected route - admin only
router.use(authenticate);
router.use(requireRole('secretaire_technique', 'comite_coordination', 'super_admin'));

router.get('/candidatures/:id', generateCandidaturePDF);

export default router;

