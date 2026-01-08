import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ObjectifResultat = sequelize.define('ObjectifResultat', {
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
  libelle_objectif: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resultat_atteint: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ordre: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'objectifs_resultats',
  timestamps: true,
  underscored: true,
});

export default ObjectifResultat;

