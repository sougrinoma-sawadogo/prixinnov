import { Link, useLocation } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon, UsersIcon } from '../common/Icons';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', Icon: ChartBarIcon },
    { path: '/admin/candidatures', label: 'Candidatures', Icon: DocumentTextIcon },
  ];

  if (user?.role?.nom === 'super_admin') {
    menuItems.push({ path: '/admin/utilisateurs', label: 'Utilisateurs', Icon: UsersIcon });
  }

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.Icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

