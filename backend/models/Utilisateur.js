import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const Utilisateur = sequelize.define('Utilisateur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  mot_de_passe: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  derniere_connexion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'utilisateurs',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (utilisateur) => {
      if (utilisateur.mot_de_passe) {
        utilisateur.mot_de_passe = await bcrypt.hash(utilisateur.mot_de_passe, 10);
      }
    },
    beforeUpdate: async (utilisateur) => {
      if (utilisateur.changed('mot_de_passe')) {
        utilisateur.mot_de_passe = await bcrypt.hash(utilisateur.mot_de_passe, 10);
      }
    },
  },
});

// Instance method to compare password
Utilisateur.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.mot_de_passe);
};

export default Utilisateur;

