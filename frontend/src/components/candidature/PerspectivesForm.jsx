import { Controller } from 'react-hook-form';

const PerspectivesForm = ({ control }) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <div>
        <label className="block text-l font-semibold text-gray-700 mb-1">
          5. Perspectives pour les 3 prochaines années *
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
              placeholder="En perspectives, pour les 3 prochaines années indiquer quels sont les objectifs visés et les besoins pour atteindre ces objectifs ?"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Besoins pour atteindre ces objectifs *
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

