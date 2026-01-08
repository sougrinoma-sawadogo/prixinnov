import { sequelize } from '../config/database.js';
import Structure from './Structure.js';
import Candidature from './Candidature.js';
import ObjectifResultat from './ObjectifResultat.js';
import PerspectiveSuivi from './PerspectiveSuivi.js';
import Evaluation from './Evaluation.js';
import PieceJointe from './PieceJointe.js';
import Role from './Role.js';
import Utilisateur from './Utilisateur.js';

// Define associations
Structure.hasMany(Candidature, { foreignKey: 'structure_id', as: 'candidatures' });
Candidature.belongsTo(Structure, { foreignKey: 'structure_id', as: 'structure' });

Candidature.hasMany(ObjectifResultat, { foreignKey: 'candidature_id', as: 'objectifs' });
ObjectifResultat.belongsTo(Candidature, { foreignKey: 'candidature_id', as: 'candidature' });

Candidature.hasOne(PerspectiveSuivi, { foreignKey: 'candidature_id', as: 'perspectives' });
PerspectiveSuivi.belongsTo(Candidature, { foreignKey: 'candidature_id', as: 'candidature' });

Candidature.hasOne(Evaluation, { foreignKey: 'candidature_id', as: 'evaluation' });
Evaluation.belongsTo(Candidature, { foreignKey: 'candidature_id', as: 'candidature' });

Candidature.hasMany(PieceJointe, { foreignKey: 'candidature_id', as: 'piecesJointes' });
PieceJointe.belongsTo(Candidature, { foreignKey: 'candidature_id', as: 'candidature' });

Role.hasMany(Utilisateur, { foreignKey: 'role_id', as: 'utilisateurs' });
Utilisateur.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Utilisateur.hasMany(Evaluation, { foreignKey: 'evaluateur_id', as: 'evaluations' });
Evaluation.belongsTo(Utilisateur, { foreignKey: 'evaluateur_id', as: 'evaluateur' });

export {
  sequelize,
  Structure,
  Candidature,
  ObjectifResultat,
  PerspectiveSuivi,
  Evaluation,
  PieceJointe,
  Role,
  Utilisateur,
};

