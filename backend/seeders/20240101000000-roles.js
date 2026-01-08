module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        nom: 'secretaire_technique',
        description: 'Secrétariat Technique - Peut consulter toutes les candidatures, modifier les statuts, préparer les dossiers',
        permissions: JSON.stringify(['view_candidatures', 'modify_statut', 'prepare_dossiers']),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nom: 'comite_coordination',
        description: 'Comité de Coordination - Peut consulter toutes les candidatures, modifier les statuts, saisir la décision finale',
        permissions: JSON.stringify(['view_candidatures', 'modify_statut', 'saisir_decision']),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nom: 'super_admin',
        description: 'Super Administrateur - Accès complet au système, gestion des utilisateurs',
        permissions: JSON.stringify(['*']),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};

