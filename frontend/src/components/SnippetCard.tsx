import React from 'react';
import type { Tag } from '../types/snippet';

interface SnippetCardProps {
  title: string;
  language: string;
  summary: string | null;
  tags: Tag[];
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, language, summary, tags }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-indigo-600 px-2 py-1 bg-indigo-50 rounded group-hover:bg-indigo-100 transition-colors uppercase tracking-wider">
          {language}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
        {summary || 'No summary available.'}
      </p>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.slice(0, 3).map((tag) => (
            <span 
              key={tag.id} 
              className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100"
            >
              #{tag.name}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] font-medium text-gray-400 px-1">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SnippetCard;
