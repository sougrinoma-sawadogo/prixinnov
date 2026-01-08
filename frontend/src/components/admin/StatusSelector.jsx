const StatusSelector = ({ currentStatut, onStatutChange, loading }) => {
  const statuts = [
    { value: 'soumis', label: 'Soumis', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'examen', label: 'En examen', color: 'bg-orange-100 text-orange-800' },
    { value: 'admis', label: 'Admis', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Statut de la candidature
      </label>
      <div className="space-y-2">
        {statuts.map((statut) => (
          <button
            key={statut.value}
            type="button"
            onClick={() => onStatutChange(statut.value)}
            disabled={loading || currentStatut === statut.value}
            className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
              currentStatut === statut.value
                ? statut.color + ' font-semibold'
                : 'bg-gray-100 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {statut.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;

