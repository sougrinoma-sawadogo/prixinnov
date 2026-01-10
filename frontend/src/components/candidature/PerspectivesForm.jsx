import { Controller } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';

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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Décrivez les moyens nécessaires (humains, financiers, techniques)"
            />
          )}
        />
      </div>
    </div>
  );
};

export default PerspectivesForm;

