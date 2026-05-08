import React from "react";
import SnippetCard from "./SnippetCard";
import type { Snippet } from "../types/snippet";

interface SnippetListProps {
  snippets: Snippet[];
  title?: string;
  onSelectSnippet?: (snippet: Snippet) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  title = "All Snippets",
  onSelectSnippet,
}) => {
  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">{title}</h1>

        {snippets.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No snippets found. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <div key={snippet.id} onClick={() => onSelectSnippet?.(snippet)}>
                <SnippetCard
                  title={snippet.title}
                  language={snippet.language}
                  summary={snippet.summary || ""}
                  tags={snippet.tags}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetList;
