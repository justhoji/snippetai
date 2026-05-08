import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SnippetCard from "./SnippetCard";
import type { Snippet, Pagination } from "../types/snippet";

interface SnippetListProps {
  snippets: Snippet[];
  title?: string;
  onSelectSnippet?: (snippet: Snippet) => void;
  pagination?: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  title = "All Snippets",
  onSelectSnippet,
  pagination,
  currentPage,
  onPageChange,
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
          <>
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

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-bold transition-all ${
                        currentPage === pageNum
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white"
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {pagination && (
              <div className="mt-4 text-center text-xs font-medium text-gray-400">
                Showing {snippets.length} of {pagination.total} snippets
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SnippetList;
