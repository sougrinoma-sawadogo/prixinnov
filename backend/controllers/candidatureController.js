import { Candidature, Structure, ObjectifResultat, PerspectiveSuivi, Evaluation, PieceJointe } from '../models/index.js';
import { Op } from 'sequelize';
import { sendCandidatureConfirmation } from '../services/emailService.js';

export const getCandidatures = async (req, res) => {
  try {
    const {
      statut,
      categorie_prix,
      type_structure,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};
    const include = [
      {
        model: Structure,
        as: 'structure',
        ...(type_structure && { where: { type_structure } }),
      },
    ];

    if (categorie_prix) {
      where.categorie_prix = categorie_prix;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let candidatures;
    let total;

    if (statut) {
      // If filtering by status, we need to join with evaluations
      include.push({
        model: Evaluation,
        as: 'evaluation',
        where: { statut },
        required: true,
      });

      candidatures = await Candidature.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
      });
      total = candidatures.count;
    } else {
      candidatures = await Candidature.findAndCountAll({
        where,
        include: [
          ...include,
          {
            model: Evaluation,
            as: 'evaluation',
            required: false,
          },
        ],
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
      });
      total = candidatures.count;
    }

    res.json({
      success: true,
      data: candidatures.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get candidatures error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des candidatures',
      error: error.message,
    });
  }
};

export const getCandidature = async (req, res) => {
  try {
    const { id } = req.params;

    const candidature = await Candidature.findByPk(id, {
      include: [
        { model: Structure, as: 'structure' },
        { model: ObjectifResultat, as: 'objectifs', order: [['ordre', 'ASC']] },
        { model: PerspectiveSuivi, as: 'perspectives' },
        { model: Evaluation, as: 'evaluation' },
        { model: PieceJointe, as: 'piecesJointes' },
      ],
    });

    if (!candidature) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée',
      });
    }

    res.json({
      success: true,
      data: candidature,
    });
  } catch (error) {
    console.error('Get candidature error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la candidature',
      error: error.message,
    });
  }
};

export const createCandidature = async (req, res) => {
  try {
    const transaction = await Candidature.sequelize.transaction();

    try {
      // Create candidature
      const candidature = await Candidature.create(
        {
          structure_id: req.body.structure_id,
          categorie_prix: req.body.categorie_prix,
          sous_categorie_special: req.body.sous_categorie_special,
          presentation_breve: req.body.presentation_breve,
          date_projet: req.body.date_projet,
          date_mise_en_oeuvre: req.body.date_mise_en_oeuvre,
          diagnostic: req.body.diagnostic,
          cible: req.body.cible,
          particularite: req.body.particularite,
          adequation_secteur: req.body.adequation_secteur,
        },
        { transaction }
      );

      // Create objectifs if provided
      if (req.body.objectifs && Array.isArray(req.body.objectifs)) {
        const objectifsData = req.body.objectifs.map((obj, index) => ({
          candidature_id: candidature.id,
          libelle_objectif: obj.libelle_objectif,
          resultat_atteint: obj.resultat_atteint || null,
          ordre: index,
        }));

        await ObjectifResultat.bulkCreate(objectifsData, { transaction });
      }

      // Create perspectives if provided (for Créativité, Émergence, Excellence)
      if (
        req.body.perspectives &&
        ['Créativité', 'Émergence', 'Excellence'].includes(req.body.categorie_prix)
      ) {
        await PerspectiveSuivi.create(
          {
            candidature_id: candidature.id,
            objectifs_3_ans: req.body.perspectives.objectifs_3_ans,
            besoins_3_ans: req.body.perspectives.besoins_3_ans,
          },
          { transaction }
        );
      }

      // Create evaluation with status "soumis"
      await Evaluation.create(
        {
          candidature_id: candidature.id,
          statut: 'soumis',
        },
        { transaction }
      );

      await transaction.commit();

      // Fetch complete candidature with relations
      const completeCandidature = await Candidature.findByPk(candidature.id, {
        include: [
          { model: Structure, as: 'structure' },
          { model: ObjectifResultat, as: 'objectifs' },
          { model: PerspectiveSuivi, as: 'perspectives' },
          { model: Evaluation, as: 'evaluation' },
        ],
      });

      // Send confirmation email (don't block response if email fails)
      try {
        const structureEmail = completeCandidature.structure?.email;
        if (structureEmail) {
          await sendCandidatureConfirmation(completeCandidature, structureEmail);
          console.log(`✅ Confirmation email sent to ${structureEmail}`);
        } else {
          console.warn('⚠️ No email address found for structure, skipping email notification');
        }
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Candidature créée avec succès',
        data: completeCandidature,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create candidature error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la candidature',
      error: error.message,
    });
  }
};

export const getCandidaturesByStructure = async (req, res) => {
  try {
    const { structureId } = req.params;

    const candidatures = await Candidature.findAll({
      where: { structure_id: structureId },
      include: [
        { model: Structure, as: 'structure' },
        { model: Evaluation, as: 'evaluation' },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: candidatures,
    });
  } catch (error) {
    console.error('Get candidatures by structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des candidatures',
      error: error.message,
    });
  }
};

