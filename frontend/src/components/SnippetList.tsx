import React from 'react';
import SnippetCard from './SnippetCard';

export interface Snippet {
  id: string;
  title: string;
  language: string;
  summary: string;
}

interface SnippetListProps {
  snippets: Snippet[];
  title?: string;
}

const SnippetList: React.FC<SnippetListProps> = ({ snippets, title = 'All Snippets' }) => {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <SnippetCard 
              key={snippet.id}
              title={snippet.title}
              language={snippet.language}
              summary={snippet.summary}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnippetList;
