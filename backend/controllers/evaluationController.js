import { Evaluation, Candidature, Utilisateur } from '../models/index.js';
import { sendAdmissionEmail } from '../services/emailService.js';

export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        {
          model: Candidature,
          as: 'candidature',
          include: [{ model: (await import('../models/index.js')).Structure, as: 'structure' }],
        },
        {
          model: Utilisateur,
          as: 'evaluateur',
          attributes: ['id', 'nom', 'prenom', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    console.error('Get evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des évaluations',
      error: error.message,
    });
  }
};

export const getEvaluation = async (req, res) => {
  try {
    const { candidatureId } = req.params;

    const evaluation = await Evaluation.findOne({
      where: { candidature_id: candidatureId },
      include: [
        {
          model: Candidature,
          as: 'candidature',
          include: [{ model: (await import('../models/index.js')).Structure, as: 'structure' }],
        },
        {
          model: Utilisateur,
          as: 'evaluateur',
          attributes: ['id', 'nom', 'prenom', 'email'],
        },
      ],
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée',
      });
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'évaluation',
      error: error.message,
    });
  }
};

export const createEvaluation = async (req, res) => {
  try {
    const { candidature_id } = req.body;

    // Check if evaluation already exists
    const existingEvaluation = await Evaluation.findOne({
      where: { candidature_id },
    });

    if (existingEvaluation) {
      return res.status(409).json({
        success: false,
        message: 'Une évaluation existe déjà pour cette candidature',
      });
    }

    const evaluation = await Evaluation.create({
      candidature_id,
      statut: 'soumis',
    });

    res.status(201).json({
      success: true,
      message: 'Évaluation créée avec succès',
      data: evaluation,
    });
  } catch (error) {
    console.error('Create evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'évaluation',
      error: error.message,
    });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByPk(id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée',
      });
    }

    const updateData = {
      statut: req.body.statut || evaluation.statut,
      decision_finale: req.body.decision_finale || evaluation.decision_finale,
      evaluateur_id: req.user.id,
      date_evaluation: new Date(),
    };

    await evaluation.update(updateData);

    res.json({
      success: true,
      message: 'Évaluation mise à jour avec succès',
      data: evaluation,
    });
  } catch (error) {
    console.error('Update evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'évaluation',
      error: error.message,
    });
  }
};

export const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['soumis', 'examen', 'admis'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }

    const evaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: Candidature,
          as: 'candidature',
          include: [{ model: (await import('../models/index.js')).Structure, as: 'structure' }],
        },
      ],
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée',
      });
    }

    const previousStatut = evaluation.statut;

    await evaluation.update({
      statut,
      evaluateur_id: req.user.id,
      date_evaluation: new Date(),
    });

    // Send admission email if status changed to "admis"
    if (statut === 'admis' && previousStatut !== 'admis') {
      try {
        const candidature = evaluation.candidature;
        const structure = candidature.structure;
        
        if (structure && structure.email) {
          await sendAdmissionEmail(candidature, structure.email);
          console.log(`✅ Admission email sent to ${structure.email} for candidature #${candidature.id}`);
        } else {
          console.warn(`⚠️  Cannot send admission email: structure email not found for candidature #${candidature.id}`);
        }
      } catch (emailError) {
        console.error('Error sending admission email:', emailError);
        // Don't fail the request if email fails, but log it
      }
    }

    res.json({
      success: true,
      message: statut === 'admis' && previousStatut !== 'admis' 
        ? 'Statut mis à jour avec succès. Un email de confirmation a été envoyé au candidat.'
        : 'Statut mis à jour avec succès',
      data: evaluation,
    });
  } catch (error) {
    console.error('Update statut error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message,
    });
  }
};

