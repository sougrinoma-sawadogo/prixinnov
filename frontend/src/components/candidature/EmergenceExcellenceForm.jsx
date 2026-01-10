import { Controller } from 'react-hook-form';
import ObjectifsTable from './ObjectifsTable';
import PerspectivesForm from './PerspectivesForm';
import RichTextEditor from './RichTextEditor';

const EmergenceExcellenceForm = ({ control, watch, setValue, categorie }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        Détails de l'Innovation - {categorie}
      </h2>

      <div>
        <label className="block text-l font-semibold text-gray-700 mb-1">
          1. Présentation brève (présentez brièvement l'innovation) *
        </label>
        <Controller
          name="presentation_breve"
          control={control}
          rules={{ required: 'Présentation brève requise' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Décrivez brièvement votre innovation"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-l font-semibold text-gray-700 mb-1">
            2. Date du projet (De quand date cette action ?) *
          </label>
          <Controller
            name="date_projet"
            control={control}
            rules={{ required: 'Date du projet requise' }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            - Date de mise en œuvre *
          </label>
          <Controller
            name="date_mise_en_oeuvre"
            control={control}
            rules={{ required: 'Date de mise en œuvre requise' }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-l font-semibold text-gray-700 mb-1">
          3. Dites en quoi votre projet est innovant ?
        </label>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Diagnostic du problème *
        </label>
        <Controller
          name="diagnostic"
          control={control}
          rules={{ required: 'Diagnostic requis' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Décrivez le problème que votre innovation résout"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Cible impactée *
        </label>
        <Controller
          name="cible"
          control={control}
          rules={{ required: 'Cible requise' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Quels sont les acteurs impactés par cette innovation ?"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Particularité de l'innovation *
        </label>
        <Controller
          name="particularite"
          control={control}
          rules={{ required: 'Particularité requise' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Qu'est-ce qui rend ce projet innovant ?"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Adéquation avec les objectifs du secteur (les documents de planification du secteur) *
        </label>
        <Controller
          name="adequation_secteur"
          control={control}
          rules={{ required: 'Adéquation requise' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Comment votre innovation s'aligne-t-elle avec les objectifs stratégiques du secteur ?"
            />
          )}
        />
        </div>
      </div>

      <ObjectifsTable control={control} watch={watch} setValue={setValue} showResultats={true} />

      <PerspectivesForm control={control} />
    </div>
  );
};

export default EmergenceExcellenceForm;

