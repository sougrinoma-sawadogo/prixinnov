import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Evaluation = sequelize.define('Evaluation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidature_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'candidatures',
      key: 'id',
    },
  },
  statut: {
    type: DataTypes.ENUM('soumis', 'examen', 'admis'),
    allowNull: false,
    defaultValue: 'soumis',
  },
  decision_finale: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  note_finale: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 20,
    },
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  evaluateur_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'utilisateurs',
      key: 'id',
    },
  },
  date_evaluation: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'evaluations',
  timestamps: true,
  underscored: true,
});

export default Evaluation;

