import { useState } from 'react';
import api from '../../services/api';
import HtmlContent from '../common/HtmlContent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CandidatureView = ({ candidature }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Try template route first, fallback to classic route
      let response;
      try {
        response = await api.get(`/pdf/candidatures/${candidature.id}/template`, {
          responseType: 'blob',
        });
      } catch (templateError) {
        // If template route fails, use classic route
        console.warn('Template route failed, using classic PDF generation:', templateError);
        response = await api.get(`/pdf/candidatures/${candidature.id}`, {
          responseType: 'blob',
        });
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Determine file extension from content type
      const contentType = response.headers['content-type'] || '';
      const extension = contentType.includes('wordprocessingml') ? '.docx' : '.pdf';
      link.setAttribute('download', `candidature-${candidature.id}${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Détails de la candidature</h3>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
        >
          {downloading ? 'Téléchargement...' : '📄 Télécharger PDF'}
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Informations de la structure</h3>
        
        {/* Affichage du logo si disponible */}
        {candidature.structure?.logo_path && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Logo de la structure</p>
            <div className="inline-block">
              <img
                src={`${API_BASE_URL}${candidature.structure.logo_path}`}
                alt="Logo de la structure"
                className="max-w-[200px] max-h-[200px] object-contain border border-gray-300 rounded shadow-sm"
                onError={(e) => {
                  console.error('Erreur chargement logo:', candidature.structure.logo_path);
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Logo chargé avec succès:', candidature.structure.logo_path);
                }}
              />
            </div>
          </div>
        )}
        
        {!candidature.structure?.logo_path && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Aucun logo n'est associé à cette structure
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Dénomination</p>
            <p className="font-medium">{candidature.structure?.denomination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sigle</p>
            <p className="font-medium">{candidature.structure?.sigle || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{candidature.structure?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{candidature.structure?.type_structure}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Détails de la candidature</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Catégorie de prix</p>
            <p className="font-medium">{candidature.categorie_prix}</p>
          </div>
          {candidature.sous_categorie_special && (
            <div>
              <p className="text-sm text-gray-500">Sous-catégorie</p>
              <p className="font-medium">{candidature.sous_categorie_special}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Présentation brève</p>
            <div className="mt-1 prose prose-sm max-w-none">
              <HtmlContent content={candidature.presentation_breve} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Diagnostic</p>
            <div className="mt-1 prose prose-sm max-w-none">
              <HtmlContent content={candidature.diagnostic} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cible</p>
            <div className="mt-1 prose prose-sm max-w-none">
              <HtmlContent content={candidature.cible} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Particularité</p>
            <div className="mt-1 prose prose-sm max-w-none">
              <HtmlContent content={candidature.particularite} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Adéquation secteur</p>
            <div className="mt-1 prose prose-sm max-w-none">
              <HtmlContent content={candidature.adequation_secteur} />
            </div>
          </div>
        </div>
      </div>

      {candidature.objectifs && candidature.objectifs.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Objectifs</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Objectif</th>
                {candidature.categorie_prix !== 'Créativité' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Résultat</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidature.objectifs.map((obj, index) => (
                <tr key={obj.id}>
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{obj.libelle_objectif}</td>
                  {candidature.categorie_prix !== 'Créativité' && (
                    <td className="px-4 py-3 text-sm">{obj.resultat_atteint || 'N/A'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {candidature.perspectives && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Perspectives à 3 ans</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Objectifs</p>
              <div className="mt-1 prose prose-sm max-w-none">
                <HtmlContent content={candidature.perspectives.objectifs_3_ans} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Besoins</p>
              <div className="mt-1 prose prose-sm max-w-none">
                <HtmlContent content={candidature.perspectives.besoins_3_ans} />
              </div>
            </div>
          </div>
        </div>
      )}

      {candidature.piecesJointes && candidature.piecesJointes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Pièces jointes</h3>
          <ul className="space-y-2">
            {candidature.piecesJointes.map((pj) => (
              <li key={pj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>{pj.libelle}</span>
                <a
                  href={`/api${pj.fichier_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Télécharger
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CandidatureView;

