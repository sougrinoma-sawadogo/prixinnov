import { body, param, query } from 'express-validator';

export const createCandidatureValidator = [
  body('structure_id').isInt().withMessage('structure_id doit être un entier'),
  body('categorie_prix')
    .isIn(['Créativité', 'Émergence', 'Excellence', 'Spéciaux'])
    .withMessage('Catégorie de prix invalide'),
  body('sous_categorie_special')
    .optional()
    .custom((value, { req }) => {
      if (req.body.categorie_prix === 'Spéciaux' && !value) {
        throw new Error('sous_categorie_special est requis pour les Prix Spéciaux');
      }
      return true;
    }),
  body('presentation_breve').notEmpty().withMessage('Présentation brève requise'),
  body('date_projet').isISO8601().withMessage('Date du projet invalide'),
  body('date_mise_en_oeuvre')
    .optional()
    .isISO8601()
    .withMessage('Date de mise en œuvre invalide')
    .custom((value, { req }) => {
      if ((req.body.categorie_prix === 'Émergence' || req.body.categorie_prix === 'Excellence') && !value) {
        throw new Error('date_mise_en_oeuvre est requis pour Émergence et Excellence');
      }
      return true;
    }),
  body('diagnostic').notEmpty().withMessage('Diagnostic requis'),
  body('cible').notEmpty().withMessage('Cible requise'),
  body('particularite').notEmpty().withMessage('Particularité requise'),
  body('adequation_secteur').notEmpty().withMessage('Adéquation avec le secteur requise'),
];

export const updateCandidatureValidator = [
  param('id').isInt().withMessage('ID invalide'),
  body('categorie_prix')
    .optional()
    .isIn(['Créativité', 'Émergence', 'Excellence', 'Spéciaux'])
    .withMessage('Catégorie de prix invalide'),
];

export const getCandidaturesValidator = [
  query('statut').optional().isIn(['soumis', 'examen', 'admis']),
  query('categorie_prix').optional().isIn(['Créativité', 'Émergence', 'Excellence', 'Spéciaux']),
  query('type_structure').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

