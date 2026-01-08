import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Structure = sequelize.define('Structure', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  denomination: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sigle: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  adresse_postale: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  identite_responsable: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contact_responsable: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  site_web: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isValidUrl(value) {
        // Skip validation if value is null, undefined, or empty string
        if (value == null || value === '' || (typeof value === 'string' && value.trim() === '')) {
          return;
        }
        
        const trimmedValue = String(value).trim();
        
        // More lenient URL validation - accepts URLs with or without protocol
        // Pattern: optional http:// or https://, domain name, optional path
        try {
          // Try using URL constructor for strict validation
          if (trimmedValue.includes('://')) {
            new URL(trimmedValue);
          } else {
            // If no protocol, add http:// temporarily for validation
            new URL(`http://${trimmedValue}`);
          }
        } catch (e) {
          // If URL constructor fails, try regex pattern
          const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
          const localhostPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?([\/\w \.-]*)*\/?$/i;
          const ipPattern = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?([\/\w \.-]*)*\/?$/i;
          
          if (!urlPattern.test(trimmedValue) && !localhostPattern.test(trimmedValue) && !ipPattern.test(trimmedValue)) {
            throw new Error('Le site web doit être une URL valide (ex: https://example.com ou example.com)');
          }
        }
      },
    },
    set(value) {
      // Convert empty string, null, or undefined to null
      if (value == null || value === '' || (typeof value === 'string' && value.trim() === '')) {
        this.setDataValue('site_web', null);
      } else {
        this.setDataValue('site_web', String(value).trim());
      }
    },
  },
  logo_path: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  type_structure: {
    type: DataTypes.ENUM(
      'Structure de mission',
      'Direction générale',
      'Structure rattachée',
      'Projet/Programme de développement',
      'Autre'
    ),
    allowNull: false,
  },
}, {
  tableName: 'structures',
  timestamps: true,
  underscored: true,
});

export default Structure;

