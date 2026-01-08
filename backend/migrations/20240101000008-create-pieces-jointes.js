module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pieces_jointes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      candidature_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'candidatures',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fichier_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      libelle: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'Contrat',
      },
      taille_fichier: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type_mime: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('pieces_jointes', ['candidature_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pieces_jointes');
  },
};

