import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EsintaxLayout from '../layouts/EsintaxLayout';
import { candidatureService } from '../services/candidatureService';
import HtmlContent from '../components/common/HtmlContent';

const CandidatureStatusPage = () => {
  const { id } = useParams();
  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidature();
  }, [id]);

  const fetchCandidature = async () => {
    try {
      setLoading(true);
      // Use public status route
      const response = await candidatureService.getStatus(id);
      if (response.success) {
        setCandidature(response.data);
      } else {
        setError('Candidature non trouvée');
      }
    } catch (err) {
      console.error('Error fetching candidature:', err);
      setError('Erreur lors du chargement de la candidature');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'soumis':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'examen':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'admis':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'soumis':
        return 'Soumis';
      case 'examen':
        return 'En examen';
      case 'admis':
        return 'Admis';
      default:
        return statut || 'Soumis';
    }
  };

  if (loading) {
    return (
      <EsintaxLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="text-lg text-gray-600">Chargement...</div>
          </div>
        </div>
      </EsintaxLayout>
    );
  }

  if (error || !candidature) {
    return (
      <EsintaxLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Candidature non trouvée'}
            </h2>
            <p className="text-gray-600 mb-6">
              La candidature que vous recherchez n'existe pas ou n'est plus accessible.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </EsintaxLayout>
    );
  }

  return (
    <EsintaxLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <Link
                to="/"
                className="text-green-600 hover:text-green-700 font-medium mb-4 inline-block"
              >
                ← Retour à l'accueil
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Statut de la candidature #{id}
              </h1>
            </div>

            {/* Status Badge */}
            <div className="mb-8">
              {(() => {
                const statut = candidature.evaluation?.statut || 'soumis';
                return (
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${getStatusColor(statut)}`}>
                    <span className="font-semibold">Statut : {getStatusLabel(statut)}</span>
                  </div>
                );
              })()}
            </div>

            {/* Structure Information */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de la structure</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Dénomination</p>
                  <p className="font-medium text-gray-900">{candidature.structure?.denomination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sigle</p>
                  <p className="font-medium text-gray-900">{candidature.structure?.sigle || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{candidature.structure?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{candidature.structure?.type_structure}</p>
                </div>
              </div>
            </div>

            {/* Candidature Details */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de la candidature</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Catégorie de prix</p>
                  <p className="font-medium text-gray-900">{candidature.categorie_prix}</p>
                </div>
                {candidature.sous_categorie_special && (
                  <div>
                    <p className="text-sm text-gray-500">Sous-catégorie spéciale</p>
                    <p className="font-medium text-gray-900">{candidature.sous_categorie_special}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Date de soumission</p>
                  <p className="font-medium text-gray-900">
                    {new Date(candidature.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {candidature.presentation_breve && (
                  <div>
                    <p className="text-sm text-gray-500">Présentation brève</p>
                    <div className="font-medium text-gray-900 prose prose-sm max-w-none">
                      <HtmlContent content={candidature.presentation_breve} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation Info if available */}
            {candidature.evaluation && (
              <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Évaluation</h2>
                <div className="space-y-2">
                  {candidature.evaluation.note_finale !== null && (
                    <div>
                      <p className="text-sm text-gray-500">Note finale</p>
                      <p className="font-medium text-gray-900 text-2xl">{candidature.evaluation.note_finale}/20</p>
                    </div>
                  )}
                  {candidature.evaluation.commentaire && (
                    <div>
                      <p className="text-sm text-gray-500">Commentaire</p>
                      <p className="font-medium text-gray-900">{candidature.evaluation.commentaire}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Retour à l'accueil
                </Link>
                <Link
                  to="/candidature"
                  className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Soumettre une autre candidature
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EsintaxLayout>
  );
};

export default CandidatureStatusPage;

