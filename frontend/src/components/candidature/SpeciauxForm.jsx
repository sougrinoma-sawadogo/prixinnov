import { Controller } from 'react-hook-form';

const SpeciauxForm = ({ control, watch, setValue }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Détails - Prix Spéciaux</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          1. Sous-catégorie *
        </label>
        <Controller
          name="sous_categorie_special"
          control={control}
          rules={{ required: 'Sous-catégorie requise' }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Sélectionner...</option>
              <option value="Souveraineté et Résilience Économique">
                Souveraineté et Résilience Économique
              </option>
              <option value="Engagement citoyen au MEF">
                Engagement citoyen au MEF
              </option>
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          2. Présentation brève (présentez brièvement l'action novatrice ou réalisation exceptionnelle) *
        </label>
        <Controller
          name="presentation_breve"
          control={control}
          rules={{ required: 'Présentation brève requise' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Décrivez brièvement votre action novatrice ou réalisation exceptionnelle"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          3. Date du projet (De quand date cette action ?) *
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

      4. Dites en quoi votre action ou réalisation est exceptionnelle ?
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Diagnostic / Contexte *
        </label>
        <Controller
          name="diagnostic"
          control={control}
          rules={{ required: 'Diagnostic requis' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Décrivez le contexte et le problème abordé"
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
            <textarea
              {...field}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Quels sont les acteurs impactés ?"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          - Particularité / Innovation *
        </label>
        <Controller
          name="particularite"
          control={control}
          rules={{ required: 'Particularité requise' }}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Qu'est-ce qui rend cette action ou réalisation exceptionnelle ?"
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
            <textarea
              {...field}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Comment cette action s'aligne-t-elle avec les objectifs stratégiques ?"
            />
          )}
        />
      </div>
    </div>
  );
};

export default SpeciauxForm;

