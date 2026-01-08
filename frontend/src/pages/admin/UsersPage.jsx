import { useEffect, useState } from 'react';
import api from '../../services/api';
import UsersTable from '../../components/admin/UsersTable';
import UserForm from '../../components/admin/UserForm';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/utilisateurs');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSuccess = () => {
    fetchUsers();
    handleCloseForm();
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Gestion des utilisateurs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Nouvel utilisateur
        </button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      <UsersTable users={users} onEdit={handleEdit} onRefresh={fetchUsers} />
    </div>
  );
};

export default UsersPage;

