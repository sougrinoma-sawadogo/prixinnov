import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.ENUM('secretaire_technique', 'comite_coordination', 'super_admin'),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true,
});

export default Role;

