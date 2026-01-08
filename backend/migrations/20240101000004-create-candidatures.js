module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('candidatures', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      structure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'structures',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categorie_prix: {
        type: Sequelize.ENUM('Créativité', 'Émergence', 'Excellence', 'Spéciaux'),
        allowNull: false,
      },
      sous_categorie_special: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      presentation_breve: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_projet: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      date_mise_en_oeuvre: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      diagnostic: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cible: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      particularite: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      adequation_secteur: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('candidatures', ['structure_id']);
    await queryInterface.addIndex('candidatures', ['categorie_prix']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('candidatures');
  },
};

