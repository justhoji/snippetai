import React from "react";
import type { Tag } from "../types/snippet";

interface SnippetCardProps {
  title: string;
  language: string;
  summary: string | null;
  tags: Tag[];
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  title,
  language,
  summary,
  tags,
}) => {
  return (
    <div className="group flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase transition-colors group-hover:bg-indigo-100">
          {language}
        </span>
      </div>
      <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-500">
        {summary || "No summary available."}
      </p>

      {tags && tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400"
            >
              #{tag.name}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-1 text-[10px] font-medium text-gray-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SnippetCard;
