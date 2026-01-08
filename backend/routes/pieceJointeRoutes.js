import express from 'express';
import {
  uploadPieceJointe,
  getPieceJointe,
  downloadPieceJointe,
  deletePieceJointe,
} from '../controllers/pieceJointeController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/', uploadSingle('fichier'), uploadPieceJointe);
router.get('/:id', getPieceJointe);
router.get('/:id/download', downloadPieceJointe);
router.delete('/:id', deletePieceJointe);

export default router;

