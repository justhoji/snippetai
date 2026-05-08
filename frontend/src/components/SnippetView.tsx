import React from "react";
import {
  ArrowLeft,
  Star,
  Edit,
  Trash,
  Copy,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Snippet } from "../types/snippet";
import CodeBlock from "./CodeBlock";
import { useSnippetView } from "../hooks/useSnippetView";

interface SnippetViewProps {
  snippet: Snippet;
  onBack: () => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: () => void;
}

const SnippetView: React.FC<SnippetViewProps> = ({
  snippet,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { state, actions, isDeleting } = useSnippetView({ snippet, onDelete });
  const { explanation, isAiLoading } = state;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-5xl pb-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="group mb-6 flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
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

        <div className="group relative mb-8">
          <button
            onClick={actions.handleCopy}
            className="absolute top-4 right-4 z-10 rounded-md border border-gray-200 bg-white/80 p-2 text-gray-600 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white"
            title="Copy Code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </div>

        <div className="space-y-6">
          <SummarySection summary={snippet.summary} />

          {explanation && <ExplanationSection explanation={explanation} />}
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
}> = ({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
  onExplain,
  isDeleting,
  isAiLoading,
  hasExplanation,
}) => (
  <div className="mb-8 flex items-start justify-between">
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
          {snippet.language}
        </span>
        <h1 className="text-3xl font-bold text-gray-900">{snippet.title}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {snippet.tags?.map((tag) => (
          <span
            key={tag.id}
            className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-400"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onExplain}
        disabled={isAiLoading}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-all ${
          hasExplanation
            ? "border border-indigo-100 bg-indigo-50 text-indigo-600"
            : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
        } disabled:opacity-50`}
      >
        <Sparkles className={`h-4 w-4 ${isAiLoading ? "animate-spin" : ""}`} />
        {isAiLoading
          ? "Analyzing..."
          : hasExplanation
            ? "Hide Explanation"
            : "Explain Code"}
      </button>

      <div className="mx-2 h-8 w-px bg-gray-100" />

      <button
        onClick={onToggleFavorite}
        className={`rounded-lg p-2 transition-colors hover:bg-gray-50 ${snippet.isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
      >
        <Star
          className={`h-5 w-5 ${snippet.isFavorite ? "fill-current" : ""}`}
        />
      </button>
      <button
        onClick={onEdit}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-indigo-600"
      >
        <Edit className="h-5 w-5" />
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-500 disabled:opacity-50"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const SummarySection: React.FC<{ summary: string | null }> = ({ summary }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
    <div className="mb-3 flex items-center gap-2">
      <MessageSquare className="h-4 w-4 text-indigo-600" />
      <h3 className="text-xs font-bold tracking-tight text-gray-900 uppercase">
        AI Summary
      </h3>
    </div>
    <p className="leading-relaxed text-gray-600">
      {summary || "No summary available for this snippet."}
    </p>
  </div>
);

const ExplanationSection: React.FC<{ explanation: string }> = ({
  explanation,
}) => (
  <div className="animate-in fade-in slide-in-from-top-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-6 duration-500">
    <div className="mb-4 flex items-center gap-2">
      <Sparkles className="h-4 w-4 text-indigo-600" />
      <h3 className="text-sm font-bold tracking-tight text-gray-900 uppercase">
        Line-by-Line Explanation
      </h3>
    </div>
    <div className="prose prose-sm prose-indigo max-w-none leading-relaxed text-gray-700">
      <ReactMarkdown>{explanation}</ReactMarkdown>
    </div>
  </div>
);

export default SnippetView;
