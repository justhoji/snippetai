import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 border-b border-gray-100 flex items-center px-8 bg-white sticky top-0 z-10">
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search snippets (Cmd + K)..."
          className="w-full bg-gray-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-indigo-200">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
