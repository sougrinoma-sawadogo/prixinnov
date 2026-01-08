import { useState } from 'react';
import api from '../../services/api';
import StatusSelector from './StatusSelector';
import DecisionEditor from './DecisionEditor';

const EvaluationPanel = ({ candidature, onUpdate }) => {
  const [statut, setStatut] = useState(candidature.evaluation?.statut || 'soumis');
  const [decision, setDecision] = useState(candidature.evaluation?.decision_finale || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateStatut = async (newStatut) => {
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
        setMessage('Statut mis à jour avec succès');
        onUpdate();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
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
          message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
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

