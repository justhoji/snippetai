import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList from './components/SnippetList';
import SnippetView from './components/SnippetView';
import SnippetForm from './components/SnippetForm';
import { useApp } from './hooks/useApp';

function App() {
  const { state, handlers } = useApp();
  const { 
    selectedSnippet, 
    isFormOpen, 
    editingSnippet, 
    searchQuery, 
    filteredSnippets, 
    currentUser, 
    isLoading, 
    snippetsError 
  } = state;
  const { 
    setSelectedSnippetId, 
    setSearchQuery, 
    handleNewSnippet, 
    handleEditSnippet, 
    handleFormClose 
  } = handlers;

  return (
    <Layout onNewSnippet={handleNewSnippet}>
      <div className="h-full flex flex-col">
        <Header 
          user={currentUser} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : snippetsError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-bold mb-2">Connection Error</h3>
              <p>Could not connect to the backend API. Please ensure the server is running at http://localhost:3001.</p>
            </div>
          </div>
        ) : selectedSnippet ? (
          <SnippetView 
            snippet={selectedSnippet} 
            onBack={() => setSelectedSnippetId(null)}
            onEdit={handleEditSnippet}
            onDelete={() => setSelectedSnippetId(null)}
          />
        ) : (
          <SnippetList 
            snippets={filteredSnippets} 
            onSelectSnippet={(s) => setSelectedSnippetId(s.id)}
          />
        )}

        {isFormOpen && (
          <SnippetForm 
            snippet={editingSnippet} 
            userId={currentUser?.id}
            onClose={handleFormClose} 
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
