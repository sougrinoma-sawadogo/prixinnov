import { Link, useLocation } from 'react-router-dom';
import EsintaxLayout from '../layouts/EsintaxLayout';

const CandidatureSuccessPage = () => {
  const location = useLocation();
  const candidatureId = location.state?.candidatureId;

  return (
    <EsintaxLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center space-y-6">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Candidature soumise avec succès !
        </h2>
        
        <p className="text-gray-600 mb-4">
          Votre candidature a été enregistrée avec succès et sera examinée par le Comité de Coordination.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>✓ Un email de confirmation</strong> a été envoyé à l'adresse email de votre structure. 
            Vous y trouverez tous les détails de votre candidature ainsi qu'un lien pour suivre son statut.
          </p>
        </div>
        
        {candidatureId && (
          <div className="mb-6">
            <span className="block text-sm font-semibold text-gray-800 bg-gray-100 p-2 rounded">
              Numéro de candidature : <strong className="text-green-600">#{candidatureId}</strong>
            </span>
          </div>
        )}
        
        <div className="space-y-3 pt-6">
          {candidatureId && (
            <Link
              to={`/candidature/statut/${candidatureId}`}
              className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors uppercase font-semibold"
            >
              Voir le statut et les détails
            </Link>
          )}
          <Link
            to="/"
            className="block w-full px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/candidature"
            className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Soumettre une autre candidature
          </Link>
        </div>
          </div>
        </div>
      </div>
    </EsintaxLayout>
  );
};

export default CandidatureSuccessPage;

