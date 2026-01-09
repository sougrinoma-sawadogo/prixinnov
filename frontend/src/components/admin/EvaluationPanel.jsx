import { useState } from 'react';
import api from '../../services/api';
import StatusSelector from './StatusSelector';
import DecisionEditor from './DecisionEditor';

const EvaluationPanel = ({ candidature, onUpdate }) => {
  const [statut, setStatut] = useState(candidature.evaluation?.statut || 'soumis');
  const [decision, setDecision] = useState(candidature.evaluation?.decision_finale || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdmissionConfirm, setShowAdmissionConfirm] = useState(false);
  const [pendingStatut, setPendingStatut] = useState(null);

  const handleUpdateStatut = async (newStatut) => {
    // Show confirmation dialog if changing to "admis"
    if (newStatut === 'admis' && statut !== 'admis') {
      setPendingStatut(newStatut);
      setShowAdmissionConfirm(true);
      return;
    }

    // For other status changes, proceed directly
    await updateStatut(newStatut);
  };

  const updateStatut = async (newStatut) => {
    setLoading(true);
    setMessage('');
    try {
      const evaluationId = candidature.evaluation?.id;
      if (!evaluationId) {
        setMessage('Erreur: Évaluation non trouvée');
        return;
      }

      const response = await api.patch(`/evaluations/${evaluationId}/statut`, {
        statut: newStatut,
      });

      if (response.data.success) {
        setStatut(newStatut);
        setMessage(response.data.message || 'Statut mis à jour avec succès');
        onUpdate();
        setShowAdmissionConfirm(false);
        setPendingStatut(null);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la mise à jour');
      setShowAdmissionConfirm(false);
      setPendingStatut(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdmission = () => {
    if (pendingStatut) {
      updateStatut(pendingStatut);
    }
  };

  const handleCancelAdmission = () => {
    setShowAdmissionConfirm(false);
    setPendingStatut(null);
  };

  const handleSaveDecision = async () => {
    setLoading(true);
    setMessage('');
    try {
      const evaluationId = candidature.evaluation?.id;
      if (!evaluationId) {
        setMessage('Erreur: Évaluation non trouvée');
        return;
      }

      const response = await api.put(`/evaluations/${evaluationId}`, {
        decision_finale: decision,
        statut: statut,
      });

      if (response.data.success) {
        setMessage('Décision enregistrée avec succès');
        onUpdate();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-xl font-semibold">Évaluation</h3>

      {message && (
        <div className={`p-3 rounded ${
          message.includes('succès') || message.includes('envoyé') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Confirmation dialog for admission */}
      {showAdmissionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Confirmer l'admission
              </h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">
                Vous êtes sur le point de marquer cette candidature comme <strong className="text-green-600">"Admise"</strong>.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Un email de confirmation sera automatiquement envoyé</strong> à l'adresse email de la structure (<strong>{candidature.structure?.email || 'N/A'}</strong>) pour l'informer que sa candidature a été admise.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir continuer ?
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAdmission}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAdmission}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'En cours...' : 'Confirmer l\'admission'}
              </button>
            </div>
          </div>
        </div>
      )}

      <StatusSelector
        currentStatut={statut}
        onStatutChange={handleUpdateStatut}
        loading={loading}
      />

      <DecisionEditor
        decision={decision}
        onDecisionChange={setDecision}
        onSave={handleSaveDecision}
        loading={loading}
      />
    </div>
  );
};

export default EvaluationPanel;

