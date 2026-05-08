import React, { useMemo } from 'react';
import { Search, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../services/userService';

interface HeaderProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSemanticSearch: boolean;
  onSemanticToggle: (active: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  isSemanticSearch,
  onSemanticToggle,
}) => {
  const { logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) return '';
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email.slice(0, 2).toUpperCase();
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return '';
    return user.name || user.email.split('@')[0];
  }, [user]);

  return (
    <header className="h-16 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <div className="flex-1 relative group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
              isSemanticSearch ? 'text-indigo-500' : 'text-gray-400 group-focus-within:text-indigo-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isSemanticSearch
                  ? "Search by intent (e.g. 'how to connect to db')..."
                  : "Search snippets by keywords..."
              }
              aria-label="Search snippets"
              className={`w-full bg-gray-50 border rounded-xl py-2 pl-10 pr-4 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/10 ${
                isSemanticSearch
                  ? 'border-indigo-200 bg-indigo-50/30'
                  : 'border-transparent focus:bg-white focus:border-gray-200'
              }`}
            />
          </div>

          <button
            onClick={() => onSemanticToggle(!isSemanticSearch)}
            aria-pressed={isSemanticSearch}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
              isSemanticSearch
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 hover:bg-indigo-700'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            title={isSemanticSearch ? "Disable Semantic Search" : "Enable Semantic Search (AI-powered)"}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${isSemanticSearch ? 'animate-pulse' : ''}`}
            />
            <span className="hidden sm:inline">
              {isSemanticSearch ? 'AI Search' : 'Keyword'}
            </span>
          </button>
        </div>

        {/* User Actions Section */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 group cursor-default">
                <span className="text-sm font-semibold text-gray-700 hidden md:block group-hover:text-indigo-600 transition-colors">
                  {displayName}
                </span>
                <div 
                  className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-extrabold border border-indigo-100 group-hover:border-indigo-300 group-hover:bg-indigo-100/50 transition-all duration-200"
                  title={user.name || user.email}
                >
                  {initials}
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
