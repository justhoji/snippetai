import React from 'react';
import { ArrowLeft, Star, Edit, Trash, Copy, Sparkles, MessageSquare } from 'lucide-react';
import type { Snippet } from '../types/snippet';
import CodeBlock from './CodeBlock';
import { useSnippetView } from '../hooks/useSnippetView';

interface SnippetViewProps {
  snippet: Snippet;
  onBack: () => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: () => void;
}

const SnippetView: React.FC<SnippetViewProps> = ({ snippet, onBack, onEdit, onDelete }) => {
  const { state, actions, isDeleting } = useSnippetView({ snippet, onDelete });
  const { explanation, isAiLoading } = state;

  return (
    <div className="flex-1 p-8 bg-white">
      <div className="max-w-5xl mx-auto pb-12">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Snippets
        </button>

        <ViewHeader 
          snippet={snippet} 
          onEdit={() => onEdit(snippet)}
          onDelete={actions.handleDelete}
          onToggleFavorite={actions.handleToggleFavorite}
          onExplain={actions.handleExplain}
          isDeleting={isDeleting}
          isAiLoading={isAiLoading}
          hasExplanation={!!explanation}
        />

        <div className="mb-8 relative group">
          <button 
            onClick={actions.handleCopy}
            className="absolute right-4 top-4 p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md text-gray-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </div>

        <div className="space-y-6">
          <SummarySection summary={snippet.summary} />
          
          {explanation && (
            <ExplanationSection explanation={explanation} />
          )}
        </div>
      </div>
    </div>
  );
};

const ViewHeader: React.FC<{ 
  snippet: Snippet; 
  onEdit: () => void; 
  onDelete: () => void;
  onToggleFavorite: () => void;
  onExplain: () => void;
  isDeleting: boolean;
  isAiLoading: boolean;
  hasExplanation: boolean;
}> = ({ snippet, onEdit, onDelete, onToggleFavorite, onExplain, isDeleting, isAiLoading, hasExplanation }) => (
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
        onClick={onExplain}
        disabled={isAiLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
          hasExplanation 
            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
        } disabled:opacity-50`}
      >
        <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
        {isAiLoading ? 'Analyzing...' : hasExplanation ? 'Explanation Active' : 'Explain Code'}
      </button>

      <div className="w-px h-8 bg-gray-100 mx-2" />

      <button 
        onClick={onToggleFavorite}
        className={`p-2 transition-colors rounded-lg hover:bg-gray-50 ${snippet.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
      >
        <Star className={`w-5 h-5 ${snippet.isFavorite ? 'fill-current' : ''}`} />
      </button>
      <button 
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50"
      >
        <Edit className="w-5 h-5" />
      </button>
      <button 
        onClick={onDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-50"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const SummarySection: React.FC<{ summary: string | null }> = ({ summary }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
    <div className="flex items-center gap-2 mb-3">
      <MessageSquare className="w-4 h-4 text-indigo-600" />
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">AI Summary</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">
      {summary || "No summary available for this snippet."}
    </p>
  </div>
);

const ExplanationSection: React.FC<{ explanation: string }> = ({ explanation }) => (
  <div className="bg-indigo-50/30 rounded-xl p-6 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-500">
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-4 h-4 text-indigo-600" />
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Line-by-Line Explanation</h3>
    </div>
    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
      {explanation}
    </div>
  </div>
);

export default SnippetView;
