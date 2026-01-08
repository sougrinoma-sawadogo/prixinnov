import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Candidature = sequelize.define('Candidature', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  structure_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'structures',
      key: 'id',
    },
  },
  categorie_prix: {
    type: DataTypes.ENUM('Créativité', 'Émergence', 'Excellence', 'Spéciaux'),
    allowNull: false,
  },
  sous_categorie_special: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isRequiredForSpeciaux(value) {
        if (this.categorie_prix === 'Spéciaux' && !value) {
          throw new Error('sous_categorie_special est requis pour les Prix Spéciaux');
        }
      },
    },
  },
  presentation_breve: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_projet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_mise_en_oeuvre: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isRequiredForEmergenceExcellence(value) {
        if ((this.categorie_prix === 'Émergence' || this.categorie_prix === 'Excellence') && !value) {
          throw new Error('date_mise_en_oeuvre est requis pour Émergence et Excellence');
        }
      },
    },
  },
  diagnostic: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cible: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  particularite: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  adequation_secteur: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'candidatures',
  timestamps: true,
  underscored: true,
});

export default Candidature;

