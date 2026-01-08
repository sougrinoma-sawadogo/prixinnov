import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const PerspectiveSuivi = sequelize.define('PerspectiveSuivi', {
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
  objectifs_3_ans: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  besoins_3_ans: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'perspectives_suivi',
  timestamps: true,
  underscored: true,
});

export default PerspectiveSuivi;

