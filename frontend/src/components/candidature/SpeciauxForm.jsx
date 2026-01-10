import { Controller } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';

const SpeciauxForm = ({ control, watch, setValue }) => {
  const sousCategorie = watch('sous_categorie_special');

  // Déterminer le label dynamique selon la sous-catégorie
  const getPresentationLabel = () => {
    if (sousCategorie === 'Souveraineté et Résilience Économique') {
      return "1. Présentez brièvement l'innovation une action novatrice ou réalisations exceptionnelles de « Souveraineté et Résilience Economique » *";
    } else if (sousCategorie === 'Engagement citoyen au MEF') {
      return "1. Présentez brièvement l'innovation une action novatrice ou réalisations exceptionnelles de « Meilleur engagement citoyen au MEF » *";
    } else {
      return "1. Présentation brève (présentez brièvement l'action novatrice ou réalisation exceptionnelle) *";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Détails - Prix Spéciaux</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sous-catégorie *
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
        <label className="block text-l font-semibold text-gray-700 mb-1">
          {getPresentationLabel()}
        </label>
        <Controller
          name="presentation_breve"
          control={control}
          rules={{ required: 'Présentation brève requise' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Décrivez brièvement votre action novatrice ou réalisation exceptionnelle"
            />
          )}
        />
      </div>

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
        <label className="block text-l font-semibold text-gray-700 mb-1">
          3. Dites en quoi votre action ou réalisation est exceptionnelle ?
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            - Diagnostic / Contexte *
          </label>
        <Controller
          name="diagnostic"
          control={control}
          rules={{ required: 'Diagnostic requis' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
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
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Comment cette action s'aligne-t-elle avec les objectifs stratégiques ?"
            />
          )}
        />
        </div>
      </div>
    </div>
  );
};

export default SpeciauxForm;

