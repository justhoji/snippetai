import React from 'react';
import { ArrowLeft, Star, Edit, Trash, Copy } from 'lucide-react';
import type { Snippet } from '../types/snippet';
import CodeBlock from './CodeBlock';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';

interface SnippetViewProps {
  snippet: Snippet;
  onBack: () => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: () => void;
}

const SnippetView: React.FC<SnippetViewProps> = ({ snippet, onBack, onEdit, onDelete }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => snippetService.delete(snippet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onDelete();
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => snippetService.update(snippet.id, { isFavorite: !snippet.isFavorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Snippets
        </button>

        {/* Header Actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-indigo-600 px-2 py-1 bg-indigo-50 rounded uppercase tracking-wider">
                {snippet.language}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">{snippet.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {snippet.tags?.map(tag => (
                <span key={tag.id} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">#{tag.name}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleFavoriteMutation.mutate()}
              className={`p-2 transition-colors rounded-lg hover:bg-gray-50 ${snippet.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className={`w-5 h-5 ${snippet.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => onEdit(snippet)}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Section */}
        <div className="mb-8 relative group">
          <button 
            onClick={handleCopy}
            className="absolute right-4 top-4 p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </div>

        {/* Summary/Description */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">AI Summary</h3>
          <p className="text-gray-600 leading-relaxed">
            {snippet.summary || "No summary available for this snippet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnippetView;
