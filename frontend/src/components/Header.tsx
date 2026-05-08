import { Search, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface HeaderProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSemanticSearch: boolean;
  onSemanticToggle: (active: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ user, searchQuery, onSearchChange, isSemanticSearch, onSemanticToggle }) => {
  const { logout } = useAuth();

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-gray-100 flex items-center px-8 bg-white sticky top-0 z-10">
      <div className="flex-1 max-w-2xl flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isSemanticSearch ? "Search by intent (e.g. 'how to connect to db')..." : "Search snippets by keywords..."}
            className={`w-full bg-gray-50 border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${
              isSemanticSearch ? 'border-indigo-200 ring-1 ring-indigo-500/10' : 'border-transparent'
            }`}
          />
        </div>
        
        <button
          onClick={() => onSemanticToggle(!isSemanticSearch)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
            isSemanticSearch 
              ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'
          }`}
          title="Toggle Semantic Search (Intent-based)"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSemanticSearch ? 'animate-pulse' : ''}`} />
          {isSemanticSearch ? 'Intent Search On' : 'Keyword Only'}
        </button>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-indigo-200">
                {getInitials(user.name, user.email)}
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
        )}
      </div>
    </header>
  );
};

export default Header;
