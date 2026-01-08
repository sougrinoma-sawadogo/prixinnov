import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import CandidatureFormPage from './pages/CandidatureFormPage';
import CandidatureSuccessPage from './pages/CandidatureSuccessPage';
import CandidatureStatusPage from './pages/CandidatureStatusPage';
import DashboardPage from './pages/admin/DashboardPage';
import CandidaturesPage from './pages/admin/CandidaturesPage';
import CandidatureDetailPage from './pages/admin/CandidatureDetailPage';
import UsersPage from './pages/admin/UsersPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/candidature" element={<CandidatureFormPage />} />
          <Route path="/candidature/success" element={<CandidatureSuccessPage />} />
          <Route path="/candidature/statut/:id" element={<CandidatureStatusPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="candidatures" element={<CandidaturesPage />} />
            <Route path="candidatures/:id" element={<CandidatureDetailPage />} />
            <Route
              path="utilisateurs"
              element={
                <ProtectedRoute requireRole="super_admin">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

