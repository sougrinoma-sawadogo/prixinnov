import express from 'express';
import { createObjectif, updateObjectif, deleteObjectif } from '../controllers/objectifController.js';

const router = express.Router();

router.post('/', createObjectif);
router.put('/:id', updateObjectif);
router.delete('/:id', deleteObjectif);

export default router;

