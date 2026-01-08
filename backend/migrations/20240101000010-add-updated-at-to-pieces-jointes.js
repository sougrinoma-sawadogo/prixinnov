module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pieces_jointes', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pieces_jointes', 'updated_at');
  },
};

