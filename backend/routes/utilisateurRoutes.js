import express from 'express';
import {
  getUtilisateurs,
  getUtilisateur,
  createUtilisateur,
  updateUtilisateur,
  toggleActif,
  resetPassword,
} from '../controllers/utilisateurController.js';
import { authenticate } from '../middleware/auth.js';
import { requireSuperAdmin } from '../middleware/role.js';

const router = express.Router();

// All routes require authentication and super admin role
router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getUtilisateurs);
router.get('/:id', getUtilisateur);
router.post('/', createUtilisateur);
router.put('/:id', updateUtilisateur);
router.patch('/:id/actif', toggleActif);
router.post('/:id/reset-password', resetPassword);

export default router;

