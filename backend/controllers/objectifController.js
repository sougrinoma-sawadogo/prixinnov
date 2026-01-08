import { ObjectifResultat, Candidature } from '../models/index.js';

export const createObjectif = async (req, res) => {
  try {
    const { candidature_id } = req.body;

    // Verify candidature exists
    const candidature = await Candidature.findByPk(candidature_id);
    if (!candidature) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée',
      });
    }

    const objectif = await ObjectifResultat.create({
      candidature_id,
      libelle_objectif: req.body.libelle_objectif,
      resultat_atteint: req.body.resultat_atteint || null,
      ordre: req.body.ordre || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Objectif créé avec succès',
      data: objectif,
    });
  } catch (error) {
    console.error('Create objectif error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'objectif',
      error: error.message,
    });
  }
};

export const updateObjectif = async (req, res) => {
  try {
    const { id } = req.params;
    const objectif = await ObjectifResultat.findByPk(id);

    if (!objectif) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé',
      });
    }

    await objectif.update({
      libelle_objectif: req.body.libelle_objectif,
      resultat_atteint: req.body.resultat_atteint,
      ordre: req.body.ordre,
    });

    res.json({
      success: true,
      message: 'Objectif mis à jour avec succès',
      data: objectif,
    });
  } catch (error) {
    console.error('Update objectif error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'objectif',
      error: error.message,
    });
  }
};

export const deleteObjectif = async (req, res) => {
  try {
    const { id } = req.params;
    const objectif = await ObjectifResultat.findByPk(id);

    if (!objectif) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé',
      });
    }

    await objectif.destroy();

    res.json({
      success: true,
      message: 'Objectif supprimé avec succès',
    });
  } catch (error) {
    console.error('Delete objectif error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'objectif',
      error: error.message,
    });
  }
};

