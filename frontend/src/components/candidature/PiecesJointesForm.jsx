import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const PiecesJointesForm = ({ candidatureId, onFilesChange, existingFiles = [] }) => {
  const [files, setFiles] = useState([]);
  const [fileLabels, setFileLabels] = useState({});

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      label: 'Contrat',
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Initialize labels
    const updatedLabels = { ...fileLabels };
    newFiles.forEach(({ id, label }) => {
      updatedLabels[id] = label;
    });
    setFileLabels(updatedLabels);
    
    onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    const updatedLabels = { ...fileLabels };
    delete updatedLabels[fileId];
    setFileLabels(updatedLabels);
    onFilesChange(updatedFiles);
  };

  const updateLabel = (fileId, label) => {
    const updatedLabels = { ...fileLabels };
    updatedLabels[fileId] = label;
    setFileLabels(updatedLabels);
    
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, label } : f
    );
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pièces jointes
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Vous pouvez ajouter plusieurs fichiers (PDF, Word, Excel, Images). Taille maximale : 10MB par fichier.
        </p>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? (
              <span className="text-green-600">Déposez les fichiers ici</span>
            ) : (
              <>
                <span className="text-green-600 font-medium">Cliquez pour télécharger</span> ou glissez-déposez
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, Word, Excel, Images (max 10MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</h4>
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={fileLabels[fileItem.id] || fileItem.label || 'Contrat'}
                    onChange={(e) => updateLabel(fileItem.id, e.target.value)}
                    placeholder="Libellé (ex: Contrat, Attestation, etc.)"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileItem.id)}
                className="ml-3 text-red-600 hover:text-red-800"
                title="Supprimer"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {existingFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-gray-700">Fichiers déjà uploadés :</h4>
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.libelle}</p>
                  <p className="text-xs text-gray-500">
                    {file.type_mime} • {file.taille_fichier ? formatFileSize(file.taille_fichier) : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PiecesJointesForm;

