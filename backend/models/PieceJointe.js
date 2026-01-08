import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PieceJointe = sequelize.define('PieceJointe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidature_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'candidatures',
      key: 'id',
    },
  },
  fichier_path: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Contrat',
  },
  taille_fichier: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_mime: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'pieces_jointes',
  timestamps: true,
  underscored: true,
});

export default PieceJointe;

