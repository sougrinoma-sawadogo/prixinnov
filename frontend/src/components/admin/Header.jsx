const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Prix de l'Innovation MEF - Administration
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-500">{user?.role?.nom}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

