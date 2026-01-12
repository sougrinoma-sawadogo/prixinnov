import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import RichTextEditor from './RichTextEditor';

const StructureForm = ({ control, structure, setStructure, setValue }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('Logo sélectionné:', file.name, 'Taille:', file.size, 'Type:', file.type);
      
      // Créer un aperçu du logo
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Enregistrer le fichier dans le formulaire et l'état local
      setSelectedLogo(file);
      if (setValue) {
        setValue('logo', file);
        console.log('Logo enregistré dans le formulaire');
      }
    }
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
    if (setValue) {
      setValue('logo', null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
                rows={1}
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
                <option value="Structure transversale rattachée au cabinet du Ministre">Structure transversale rattachée au cabinet du Ministre</option>
                <option value="Direction générale">Direction générale</option>
                <option value="Structure transversale rattachée au Secrétariat général">Structure transversale rattachée au Secrétariat général</option>
                <option value="Structure rattachée">Structure rattachée</option>
                <option value="Projet ou programme de développement sous tutelle technique du MEF">Projet ou programme de développement sous tutelle technique du MEF</option>
                <option value="Autres">Autres</option>
              </select>
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo de la structure
        </label>
        
        {selectedLogo ? (
          <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Aperçu du logo"
                    className="w-16 h-16 object-contain rounded border border-gray-300 bg-white"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedLogo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedLogo.size)}
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✓ Logo sélectionné
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} name="logo" />
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-600">
              {isDragActive
                ? 'Déposez le fichier ici...'
                : 'Glissez-déposez le logo ici, ou cliquez pour sélectionner'}
            </p>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StructureForm;

