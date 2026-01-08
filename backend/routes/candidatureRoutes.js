import express from 'express';
import {
  getCandidatures,
  getCandidature,
  createCandidature,
  getCandidaturesByStructure,
} from '../controllers/candidatureController.js';
import { createCandidatureValidator, getCandidaturesValidator } from '../validators/candidatureValidator.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/', createCandidatureValidator, validate, createCandidature);
router.get('/structure/:structureId', getCandidaturesByStructure);
router.get('/statut/:id', getCandidature); // Public route for status check

// Admin routes (will be protected in server.js)
router.get('/', getCandidaturesValidator, validate, getCandidatures);
router.get('/:id', getCandidature);

export default router;

