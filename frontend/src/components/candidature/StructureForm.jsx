import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

const StructureForm = ({ control, structure, setStructure }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      // Handle file upload
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Informations de la Structure</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dénomination *
          </label>
          <Controller
            name="denomination"
            control={control}
            rules={{ required: 'Dénomination requise' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Nom complet de la structure"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sigle
          </label>
          <Controller
            name="sigle"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Sigle officiel"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse postale *
          </label>
          <Controller
            name="adresse_postale"
            control={control}
            rules={{ required: 'Adresse postale requise' }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Adresse complète"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="email@example.com"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identité du responsable *
          </label>
          <Controller
            name="identite_responsable"
            control={control}
            rules={{ required: 'Identité du responsable requise' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Nom et prénom"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact du responsable *
          </label>
          <Controller
            name="contact_responsable"
            control={control}
            rules={{ required: 'Contact du responsable requis' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Téléphone"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site web
          </label>
          <Controller
            name="site_web"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com (optionnel)"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de structure *
          </label>
          <Controller
            name="type_structure"
            control={control}
            rules={{ required: 'Type de structure requis' }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sélectionner...</option>
                <option value="Structure de mission">Structure de mission</option>
                <option value="Direction générale">Direction générale</option>
                <option value="Structure rattachée">Structure rattachée</option>
                <option value="Projet/Programme de développement">Projet/Programme de développement</option>
                <option value="Autre">Autre</option>
              </select>
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo de la structure
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} name="logo" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Déposez le fichier ici...'
              : 'Glissez-déposez le logo ici, ou cliquez pour sélectionner'}
          </p>
          <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default StructureForm;

