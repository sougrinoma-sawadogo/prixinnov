import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { candidatureService } from '../../services/candidatureService';
import CandidatureView from '../../components/admin/CandidatureView';
import EvaluationPanel from '../../components/admin/EvaluationPanel';

const CandidatureDetailPage = () => {
  const { id } = useParams();
  const [candidature, setCandidature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidature();
  }, [id]);

  const fetchCandidature = async () => {
    try {
      const response = await candidatureService.getById(id);
      if (response.success) {
        setCandidature(response.data);
      }
    } catch (error) {
      console.error('Error fetching candidature:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!candidature) {
    return <div className="text-center py-12">Candidature non trouvée</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-indigo-600 hover:text-indigo-800 mb-4"
        >
          ← Retour
        </button>
        <h2 className="text-3xl font-bold">Détails de la candidature #{id}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandidatureView candidature={candidature} />
        </div>
        <div>
          <EvaluationPanel
            candidature={candidature}
            onUpdate={fetchCandidature}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidatureDetailPage;

