import React from 'react';
import { Home, Folder, Tag, Star, Plus, ChevronRight, Hash, Trash } from 'lucide-react';
import type { Folder as FolderType, Tag as TagType } from '../types/snippet';

interface SidebarProps {
  folders: FolderType[];
  tags: TagType[];
  activeFilter: 'all' | 'favorites' | 'folder' | 'tag';
  activeId: string | null;
  onFilterChange: (filter: 'all' | 'favorites' | 'folder' | 'tag', id: string | null) => void;
  onNewSnippet: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  isCreatingFolder: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  folders, 
  tags, 
  activeFilter, 
  activeId, 
  onFilterChange, 
  onNewSnippet,
  onCreateFolder,
  onDeleteFolder,
  isCreatingFolder
}) => {
  const [isAddingFolder, setIsAddingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [showAllTags, setShowAllTags] = React.useState(false);

  const TAG_LIMIT = 10;
  const displayedTags = showAllTags ? tags : tags.slice(0, TAG_LIMIT);

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 h-screen flex flex-col overflow-hidden">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">CV</span>
          </div>
          CodeVault
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
        {/* Main Filters */}
        <nav className="space-y-1">
          <NavItem 
            icon={Home} 
            label="All Snippets" 
            active={activeFilter === 'all'} 
            onClick={() => onFilterChange('all', null)}
          />
          <NavItem 
            icon={Star} 
            label="Favorites" 
            active={activeFilter === 'favorites'} 
            onClick={() => onFilterChange('favorites', null)}
          />
        </nav>

        {/* Folders */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-3 h-3" /> Folders
            </h3>
            <button 
              onClick={() => setIsAddingFolder(true)}
              className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {isAddingFolder && (
            <form onSubmit={handleFolderSubmit} className="px-3 mb-2">
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => !newFolderName && setIsAddingFolder(false)}
                placeholder="Folder name..."
                className="w-full px-2 py-1 text-xs border border-indigo-300 rounded outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={isCreatingFolder}
              />
            </form>
          )}

          <div className="space-y-1">
            {folders.length === 0 && !isAddingFolder ? (
              <p className="px-3 text-xs text-gray-400 italic">No folders created</p>
            ) : (
              folders.map(folder => (
                <div key={folder.id} className="group/folder relative">
                  <NavItem 
                    icon={ChevronRight}
                    label={folder.name}
                    active={activeFilter === 'folder' && activeId === folder.id}
                    onClick={() => onFilterChange('folder', folder.id)}
                    compact
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete folder "${folder.name}"? Snippets will not be deleted.`)) {
                        onDeleteFolder(folder.id);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover/folder:opacity-100 transition-opacity"
                    title="Delete Folder"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-1 px-3">
            {tags.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No tags yet</p>
            ) : (
              <>
                {displayedTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => onFilterChange('tag', tag.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      activeFilter === 'tag' && activeId === tag.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    {tag.name}
                  </button>
                ))}
                
                {tags.length > TAG_LIMIT && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1 transition-colors"
                  >
                    {showAllTags ? 'Show less' : `+${tags.length - TAG_LIMIT} more`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <button 
          onClick={onNewSnippet}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Snippet
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, compact }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 rounded-md transition-colors ${
      compact ? 'py-1.5 text-xs' : 'py-2 text-sm'
    } font-medium ${
      active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
    <span className="truncate">{label}</span>
  </button>
);

export default Sidebar;
