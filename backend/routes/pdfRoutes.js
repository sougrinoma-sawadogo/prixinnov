import express from 'express';
import { generateCandidaturePDF, generateCandidaturePDFFromTemplate } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Protected route - admin only
router.use(authenticate);
router.use(requireRole('secretaire_technique', 'comite_coordination', 'super_admin'));

// Route avec template Word (prioritaire si template existe)
router.get('/candidatures/:id/template', generateCandidaturePDFFromTemplate);

// Route classique avec PDFKit (fallback)
router.get('/candidatures/:id', generateCandidaturePDF);

export default router;

