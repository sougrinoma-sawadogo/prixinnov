module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('structures', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      denomination: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sigle: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      adresse_postale: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      identite_responsable: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      contact_responsable: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      site_web: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      logo_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      type_structure: {
        type: Sequelize.ENUM(
          'Structure de mission',
          'Direction générale',
          'Structure rattachée',
          'Projet/Programme de développement',
          'Autre'
        ),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('structures');
  },
};

