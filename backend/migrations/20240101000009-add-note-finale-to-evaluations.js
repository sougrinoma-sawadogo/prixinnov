module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('evaluations', 'note_finale', {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('evaluations', 'commentaire', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('evaluations', 'note_finale');
    await queryInterface.removeColumn('evaluations', 'commentaire');
  },
};

