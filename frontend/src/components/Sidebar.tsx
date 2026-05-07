import { Home, Folder, Tag, Star, Plus } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'All Snippets', active: true },
    { icon: Star, label: 'Favorites', active: false },
    { icon: Folder, label: 'Folders', active: false },
    { icon: Tag, label: 'Tags', active: false },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">CV</span>
          </div>
          CodeVault
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              item.active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          New Snippet
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
