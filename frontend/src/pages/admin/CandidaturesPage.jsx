import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatureService } from '../../services/candidatureService';
import CandidaturesTable from '../../components/admin/CandidaturesTable';
import FiltersPanel from '../../components/admin/FiltersPanel';

const CandidaturesPage = () => {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    statut: '',
    categorie_prix: '',
    type_structure: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCandidatures();
  }, [filters]);

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const response = await candidatureService.getAll(filters);
      if (response.success) {
        setCandidatures(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching candidatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleView = (id) => {
    navigate(`/admin/candidatures/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Candidatures</h2>
      </div>

      <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <CandidaturesTable
          candidatures={candidatures}
          onView={handleView}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CandidaturesPage;

