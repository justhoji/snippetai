import React from 'react';
import Sidebar from './Sidebar';
import type { Folder, Tag } from '../types/snippet';

interface LayoutProps {
  children: React.ReactNode;
  folders: Folder[];
  tags: Tag[];
  activeFilter: 'all' | 'favorites' | 'folder' | 'tag';
  activeId: string | null;
  onFilterChange: (filter: 'all' | 'favorites' | 'folder' | 'tag', id: string | null) => void;
  onNewSnippet: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  isCreatingFolder: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
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
  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      <Sidebar 
        folders={folders}
        tags={tags}
        activeFilter={activeFilter}
        activeId={activeId}
        onFilterChange={onFilterChange}
        onNewSnippet={onNewSnippet} 
        onCreateFolder={onCreateFolder}
        onDeleteFolder={onDeleteFolder}
        isCreatingFolder={isCreatingFolder}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
