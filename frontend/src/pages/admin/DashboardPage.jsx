import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatisticsCards from '../../components/admin/StatisticsCards';

const DashboardPage = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/statistics');
        if (response.data.success) {
          setStatistics(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Tableau de bord</h2>
      {statistics && <StatisticsCards statistics={statistics} />}
    </div>
  );
};

export default DashboardPage;

