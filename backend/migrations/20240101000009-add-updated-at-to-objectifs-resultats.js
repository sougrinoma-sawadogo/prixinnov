module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('objectifs_resultats', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('objectifs_resultats', 'updated_at');
  },
};

