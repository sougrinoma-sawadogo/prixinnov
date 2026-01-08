import { Candidature, Evaluation, Structure } from '../models/index.js';
import { Op } from 'sequelize';

export const getStatistics = async (req, res) => {
  try {
    // Total candidatures
    const totalCandidatures = await Candidature.count();

    // Candidatures by status
    const candidaturesByStatut = await Evaluation.findAll({
      attributes: [
        'statut',
        [Candidature.sequelize.fn('COUNT', Candidature.sequelize.col('Evaluation.id')), 'count'],
      ],
      include: [
        {
          model: Candidature,
          as: 'candidature',
          attributes: [],
        },
      ],
      group: ['statut'],
      raw: true,
    });

    // Candidatures by category
    const candidaturesByCategory = await Candidature.findAll({
      attributes: [
        'categorie_prix',
        [Candidature.sequelize.fn('COUNT', Candidature.sequelize.col('Candidature.id')), 'count'],
      ],
      group: ['categorie_prix'],
      raw: true,
    });

    // Candidatures by type structure
    const candidaturesByTypeStructure = await Candidature.findAll({
      attributes: [
        [Structure.sequelize.col('type_structure'), 'type_structure'],
        [Candidature.sequelize.fn('COUNT', Candidature.sequelize.col('Candidature.id')), 'count'],
      ],
      include: [
        {
          model: Structure,
          as: 'structure',
          attributes: [],
        },
      ],
      group: [Structure.sequelize.col('type_structure')],
      raw: true,
    });

    // Recent candidatures (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentCandidatures = await Candidature.count({
      where: {
        created_at: {
          [Op.gte]: twentyFourHoursAgo,
        },
      },
    });

    res.json({
      success: true,
      data: {
        total: totalCandidatures,
        byStatut: candidaturesByStatut.reduce((acc, item) => {
          acc[item.statut] = parseInt(item.count);
          return acc;
        }, {}),
        byCategory: candidaturesByCategory.reduce((acc, item) => {
          acc[item.categorie_prix] = parseInt(item.count);
          return acc;
        }, {}),
        byTypeStructure: candidaturesByTypeStructure.reduce((acc, item) => {
          acc[item.type_structure] = parseInt(item.count);
          return acc;
        }, {}),
        recent: recentCandidatures,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

