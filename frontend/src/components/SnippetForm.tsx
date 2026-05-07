import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { sql } from "@codemirror/lang-sql";
import { X, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "../services/snippetService";
import type { Snippet, CreateSnippetInput } from "../types/snippet";

interface SnippetFormProps {
  snippet?: Snippet | null;
  userId?: string;
  onClose: () => void;
}

const LANGUAGES = [
  {
    label: "TypeScript",
    value: "typescript",
    extension: javascript({ typescript: true }),
  },
  { label: "JavaScript", value: "javascript", extension: javascript() },
  { label: "Python", value: "python", extension: python() },
  { label: "HTML", value: "html", extension: html() },
  { label: "SQL", value: "sql", extension: sql() },
];

const SnippetForm: React.FC<SnippetFormProps> = ({
  snippet,
  userId,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(snippet?.title || "");
  const [language, setLanguage] = useState(
    snippet?.language.toLowerCase() || "typescript",
  );
  const [code, setCode] = useState(snippet?.code || "");
  const [tags, setTags] = useState(
    snippet?.tags.map((t) => t.name).join(", ") || "",
  );
  const [summary, setSummary] = useState(snippet?.summary || "");

  const mutation = useMutation({
    mutationFn: (data: CreateSnippetInput) => {
      if (snippet) {
        return snippetService.update(snippet.id, data);
      }
      return snippetService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      alert(
        error.response?.data ||
          "Failed to save snippet. Please check if your user exists.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId && !snippet?.userId) {
      alert(
        "Error: No active user found. Please ensure at least one user exists in the database.",
      );
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload: CreateSnippetInput = {
      title,
      language,
      code,
      summary,
      userId: snippet?.userId || userId!,
      isFavorite: snippet?.isFavorite || false,
      folderId: snippet?.folderId || null,
      tags: tagList,
    };

    mutation.mutate(payload);
  };

  const selectedLang =
    LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {snippet ? "Edit Snippet" : "Create New Snippet"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fetch API Wrapper"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Code</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <CodeMirror
                value={code}
                height="300px"
                extensions={[selectedLang.extension]}
                onChange={(value) => setCode(value)}
                theme="light"
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., react, hooks, api"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              AI Summary (Optional)
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this code does..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Saving..." : "Save Snippet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetForm;
