const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupérer le rôle super_admin
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE nom = 'super_admin' LIMIT 1"
    );

    if (roles.length === 0) {
      throw new Error('Le rôle super_admin n\'existe pas. Veuillez exécuter le seeder de rôles d\'abord.');
    }

    const superAdminRoleId = roles[0].id;

    // Hasher les mots de passe
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    await queryInterface.bulkInsert('utilisateurs', [
      {
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@mef.gov.bf',
        mot_de_passe: passwordHash,
        role_id: superAdminRoleId,
        telephone: '+226 25 30 60 60',
        actif: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nom: 'Secrétariat',
        prenom: 'Technique',
        email: 'secretaire.technique@mef.gov.bf',
        mot_de_passe: passwordHash,
        role_id: superAdminRoleId,
        telephone: '+226 25 30 60 60',
        actif: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('utilisateurs', {
      email: {
        [Sequelize.Op.in]: ['admin@mef.gov.bf', 'secretaire.technique@mef.gov.bf']
      }
    }, {});
  },
};

