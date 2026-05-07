import { Search } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface HeaderProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, searchQuery, onSearchChange }) => {
  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-gray-100 flex items-center px-8 bg-white sticky top-0 z-10">
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search snippets (Cmd + K)..."
          className="w-full bg-gray-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-indigo-200">
              {getInitials(user.name, user.email)}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
        )}
      </div>
    </header>
  );
};

export default Header;
