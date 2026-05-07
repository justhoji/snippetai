import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList from './components/SnippetList';
import SnippetView from './components/SnippetView';
import SnippetForm from './components/SnippetForm';
import { snippetService } from './services/snippetService';
import type { Snippet } from './types/snippet';

function App() {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);

  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  const handleNewSnippet = () => {
    setEditingSnippet(null);
    setIsFormOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSnippet(null);
  };

  return (
    <Layout onNewSnippet={handleNewSnippet}>
      <div className="h-full flex flex-col">
        <Header />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-bold mb-2">Connection Error</h3>
              <p>Could not connect to the backend API. Please ensure the server is running at http://localhost:3001.</p>
            </div>
          </div>
        ) : selectedSnippet ? (
          <SnippetView 
            snippet={selectedSnippet} 
            onBack={() => setSelectedSnippet(null)}
            onEdit={handleEditSnippet}
            onDelete={() => setSelectedSnippet(null)}
          />
        ) : (
          <SnippetList 
            snippets={snippets || []} 
            onSelectSnippet={setSelectedSnippet}
          />
        )}

        {isFormOpen && (
          <SnippetForm 
            snippet={editingSnippet} 
            onClose={handleFormClose} 
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
