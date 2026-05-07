import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList from './components/SnippetList';
import SnippetView from './components/SnippetView';
import { snippetService } from './services/snippetService';
import type { Snippet } from './types/snippet';

function App() {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <Header />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            Error loading snippets. Please ensure the backend is running.
          </div>
        ) : selectedSnippet ? (
          <SnippetView 
            snippet={selectedSnippet} 
            onBack={() => setSelectedSnippet(null)} 
          />
        ) : (
          <SnippetList 
            snippets={snippets || []} 
            onSelectSnippet={setSelectedSnippet}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
