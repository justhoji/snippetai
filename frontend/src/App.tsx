import { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList from './components/SnippetList';
import SnippetView from './components/SnippetView';
import SnippetForm from './components/SnippetForm';
import Login from './components/Login';
import Register from './components/Register';
import { useApp } from './hooks/useApp';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, isLoading: authLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  const { state, handlers } = useApp();
  const { 
    selectedSnippet, 
    isFormOpen, 
    editingSnippet, 
    searchQuery, 
    isSemanticSearch,
    filteredSnippets, 
    currentUser,
    folders,
    tags,
    filterType,
    activeId,
    isLoading: appLoading, 
    snippetsError,
    isCreatingFolder
  } = state;
  const { 
    setSelectedSnippetId, 
    setSearchQuery,
    setIsSemanticSearch,
    setFilterType,
    setActiveId,
    handleNewSnippet, 
    handleEditSnippet, 
    handleFormClose,
    handleCreateFolder,
    handleDeleteFolder
  } = handlers;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const handleFilterChange = (type: 'all' | 'favorites' | 'folder' | 'tag', id: string | null) => {
    setFilterType(type);
    setActiveId(id);
    setSelectedSnippetId(null); // Return to list view when changing filters
  };

  const getListTitle = () => {
    if (filterType === 'all') return 'All Snippets';
    if (filterType === 'favorites') return 'Favorites';
    if (filterType === 'folder' && activeId) {
      return folders?.find(f => f.id === activeId)?.name || 'Folder';
    }
    if (filterType === 'tag' && activeId) {
      const tag = tags?.find(t => t.id === activeId);
      return tag ? `#${tag.name}` : 'Tag';
    }
    return 'Snippets';
  };

  return (
    <Layout 
      onNewSnippet={handleNewSnippet}
      folders={folders || []}
      tags={tags || []}
      activeFilter={filterType}
      activeId={activeId}
      onFilterChange={handleFilterChange}
      onCreateFolder={handleCreateFolder}
      onDeleteFolder={handleDeleteFolder}
      isCreatingFolder={isCreatingFolder}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {selectedSnippet ? (
          <SnippetView 
            snippet={selectedSnippet} 
            onBack={() => setSelectedSnippetId(null)}
            onEdit={handleEditSnippet}
            onDelete={() => setSelectedSnippetId(null)}
          />
        ) : (
          <>
            <Header 
              user={currentUser} 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isSemanticSearch={isSemanticSearch}
              onSemanticToggle={setIsSemanticSearch}
            />
            
            <div className="flex-1 overflow-y-auto">
              {appLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : snippetsError ? (
                <div className="h-full flex items-center justify-center text-red-500 p-8 text-center">
                  <div className="max-w-md">
                    <h3 className="text-lg font-bold mb-2">Connection Error</h3>
                    <p>Could not connect to the backend API. Please ensure the server is running at http://localhost:3001.</p>
                  </div>
                </div>
              ) : (
                <SnippetList 
                  snippets={filteredSnippets} 
                  title={getListTitle()}
                  onSelectSnippet={(s) => setSelectedSnippetId(s.id)}
                />
              )}
            </div>
          </>
        )}

        {isFormOpen && (
          <SnippetForm 
            snippet={editingSnippet} 
            folders={folders || []}
            onClose={handleFormClose} 
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
