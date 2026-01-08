const DecisionEditor = ({ decision, onDecisionChange, onSave, loading }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        DÉCISION DU COMITÉ DE COORDINATION DU PRIX INNOVATION
      </label>
      <textarea
        value={decision}
        onChange={(e) => onDecisionChange(e.target.value)}
        rows={10}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Saisissez la décision du comité..."
      />
      <button
        onClick={onSave}
        disabled={loading}
        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer la décision'}
      </button>
    </div>
  );
};

export default DecisionEditor;

