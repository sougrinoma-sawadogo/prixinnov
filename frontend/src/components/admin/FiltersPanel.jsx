const FiltersPanel = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      statut: '',
      categorie_prix: '',
      type_structure: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Réinitialiser
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={filters.statut}
            onChange={(e) => handleChange('statut', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous</option>
            <option value="soumis">Soumis</option>
            <option value="examen">En examen</option>
            <option value="admis">Admis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={filters.categorie_prix}
            onChange={(e) => handleChange('categorie_prix', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Toutes</option>
            <option value="Créativité">Créativité</option>
            <option value="Émergence">Émergence</option>
            <option value="Excellence">Excellence</option>
            <option value="Spéciaux">Spéciaux</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de structure
          </label>
          <select
            value={filters.type_structure}
            onChange={(e) => handleChange('type_structure', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous</option>
            <option value="Structure de mission">Structure de mission</option>
            <option value="Structure transversale rattachée au cabinet du Ministre">Structure transversale rattachée au cabinet du Ministre</option>
            <option value="Direction générale">Direction générale</option>
            <option value="Structure transversale rattachée au Secrétariat général">Structure transversale rattachée au Secrétariat général</option>
            <option value="Structure rattachée">Structure rattachée</option>
            <option value="Projet ou programme de développement sous tutelle technique du MEF">Projet ou programme de développement sous tutelle technique du MEF</option>
            <option value="Autres">Autres</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;

