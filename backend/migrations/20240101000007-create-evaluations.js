module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('evaluations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      candidature_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'candidatures',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      statut: {
        type: Sequelize.ENUM('soumis', 'examen', 'admis'),
        allowNull: false,
        defaultValue: 'soumis',
      },
      decision_finale: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      evaluateur_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date_evaluation: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex('evaluations', ['candidature_id'], { unique: true });
    await queryInterface.addIndex('evaluations', ['statut']);
    await queryInterface.addIndex('evaluations', ['evaluateur_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('evaluations');
  },
};

