import { PieceJointe, Candidature } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadPieceJointe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Fichier requis',
      });
    }

    const { candidature_id, libelle } = req.body;

    // Verify candidature exists
    const candidature = await Candidature.findByPk(candidature_id);
    if (!candidature) {
      // Delete uploaded file if candidature doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée',
      });
    }

    const pieceJointe = await PieceJointe.create({
      candidature_id,
      fichier_path: `/uploads/${req.file.filename}`,
      libelle: libelle || 'Contrat',
      taille_fichier: req.file.size,
      type_mime: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: 'Pièce jointe uploadée avec succès',
      data: pieceJointe,
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload piece jointe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de la pièce jointe',
      error: error.message,
    });
  }
};

export const getPieceJointe = async (req, res) => {
  try {
    const { id } = req.params;
    const pieceJointe = await PieceJointe.findByPk(id);

    if (!pieceJointe) {
      return res.status(404).json({
        success: false,
        message: 'Pièce jointe non trouvée',
      });
    }

    res.json({
      success: true,
      data: pieceJointe,
    });
  } catch (error) {
    console.error('Get piece jointe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la pièce jointe',
      error: error.message,
    });
  }
};

export const downloadPieceJointe = async (req, res) => {
  try {
    const { id } = req.params;
    const pieceJointe = await PieceJointe.findByPk(id);

    if (!pieceJointe) {
      return res.status(404).json({
        success: false,
        message: 'Pièce jointe non trouvée',
      });
    }

    const filePath = path.join(__dirname, '..', pieceJointe.fichier_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé sur le serveur',
      });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors du téléchargement',
        });
      }
    });
  } catch (error) {
    console.error('Download piece jointe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement de la pièce jointe',
      error: error.message,
    });
  }
};

export const deletePieceJointe = async (req, res) => {
  try {
    const { id } = req.params;
    const pieceJointe = await PieceJointe.findByPk(id);

    if (!pieceJointe) {
      return res.status(404).json({
        success: false,
        message: 'Pièce jointe non trouvée',
      });
    }

    const filePath = path.join(__dirname, '..', pieceJointe.fichier_path);

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pieceJointe.destroy();

    res.json({
      success: true,
      message: 'Pièce jointe supprimée avec succès',
    });
  } catch (error) {
    console.error('Delete piece jointe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la pièce jointe',
      error: error.message,
    });
  }
};

