module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('objectifs_resultats', {
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
      libelle_objectif: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      resultat_atteint: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ordre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('objectifs_resultats', ['candidature_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('objectifs_resultats');
  },
};

