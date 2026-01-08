import express from 'express';
import { createStructure, getStructure, updateStructure } from '../controllers/structureController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes (for candidature submission)
router.post('/', uploadSingle('logo'), createStructure);
router.get('/:id', getStructure);
router.put('/:id', uploadSingle('logo'), updateStructure);

export default router;

