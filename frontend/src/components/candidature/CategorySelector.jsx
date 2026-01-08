const CategorySelector = ({ categorie, setCategorie }) => {
  const categories = [
    {
      value: 'Créativité',
      title: 'Prix Créativité',
      description: 'Pour les innovations au stade d\'idée',
      icon: '💡',
    },
    {
      value: 'Émergence',
      title: 'Prix Émergence',
      description: 'Pour les produits, services ou projets en cours de mise en œuvre',
      icon: '🌱',
    },
    {
      value: 'Excellence',
      title: 'Prix Excellence',
      description: 'Pour les innovations confirmées ayant atteint des résultats probants',
      icon: '⭐',
    },
    {
      value: 'Spéciaux',
      title: 'Prix Spéciaux',
      description: 'Souveraineté/Résilience Économique ou Engagement citoyen au MEF',
      icon: '🏆',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Sélectionnez la Catégorie de Prix</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategorie(cat.value)}
            className={`p-6 border-2 rounded-lg text-left transition-all ${
              categorie === cat.value
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <div className="text-4xl mb-2">{cat.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
            <p className="text-gray-600 text-sm">{cat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;

