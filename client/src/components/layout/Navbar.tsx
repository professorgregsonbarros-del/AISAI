import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800">AI-SAI</span>
        <span className="text-sm text-gray-500 hidden sm:inline">Teacher Hub</span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Olá, <strong>{user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
