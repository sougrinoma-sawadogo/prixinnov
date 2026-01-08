import { Controller } from 'react-hook-form';

const ObjectifsTable = ({ control, watch, setValue, showResultats }) => {
  const objectifs = watch('objectifs') || [];

  const addObjectif = () => {
    const newObjectifs = [...objectifs, { libelle_objectif: '', resultat_atteint: '' }];
    setValue('objectifs', newObjectifs);
  };

  const removeObjectif = (index) => {
    const newObjectifs = objectifs.filter((_, i) => i !== index);
    setValue('objectifs', newObjectifs);
  };

  const updateObjectif = (index, field, value) => {
    const newObjectifs = [...objectifs];
    newObjectifs[index] = { ...newObjectifs[index], [field]: value };
    setValue('objectifs', newObjectifs);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Objectifs visés</h3>
        <button
          type="button"
          onClick={addObjectif}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          + Ajouter un objectif
        </button>
      </div>

      {objectifs.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun objectif ajouté. Cliquez sur "Ajouter un objectif" pour commencer.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Libellé de l'objectif *
                </th>
                {showResultats && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Résultat atteint *
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {objectifs.map((objectif, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={objectif.libelle_objectif || ''}
                      onChange={(e) => updateObjectif(index, 'libelle_objectif', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                      placeholder="Description de l'objectif"
                      required
                    />
                  </td>
                  {showResultats && (
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={objectif.resultat_atteint || ''}
                        onChange={(e) => updateObjectif(index, 'resultat_atteint', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        placeholder="Résultat atteint"
                        required
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => removeObjectif(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ObjectifsTable;

