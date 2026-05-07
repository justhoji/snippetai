import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList from './components/SnippetList';
import SnippetView from './components/SnippetView';
import SnippetForm from './components/SnippetForm';
import { snippetService } from './services/snippetService';
import { userService } from './services/userService';
import type { Snippet } from './types/snippet';

function App() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: snippets, isLoading: snippetsLoading, error: snippetsError } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const currentUser = users?.[0] || null;

  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    if (!searchQuery.trim()) return snippets;

    const query = searchQuery.toLowerCase();
    return snippets.filter(s => 
      s.title.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.language.toLowerCase().includes(query) ||
      s.tags.some(t => t.name.toLowerCase().includes(query))
    );
  }, [snippets, searchQuery]);

  const selectedSnippet = useMemo(() => {
    return snippets?.find(s => s.id === selectedSnippetId) || null;
  }, [snippets, selectedSnippetId]);

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

  const isLoading = snippetsLoading || usersLoading;

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
