import { Controller } from 'react-hook-form';

const PerspectivesForm = ({ control }) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-semibold">Perspectives à 3 ans</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objectifs visés pour les 3 prochaines années *
        </label>
        <Controller
          name="perspectives.objectifs_3_ans"
          control={control}
          rules={{ required: 'Objectifs 3 ans requis' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Décrivez vos objectifs pour les 3 prochaines années"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Besoins pour atteindre ces objectifs *
        </label>
        <Controller
          name="perspectives.besoins_3_ans"
          control={control}
          rules={{ required: 'Besoins 3 ans requis' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Décrivez les moyens nécessaires (humains, financiers, techniques)"
            />
          )}
        />
      </div>
    </div>
  );
};

export default PerspectivesForm;

