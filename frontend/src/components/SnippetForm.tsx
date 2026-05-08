import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { X, Save, Sparkles, Wand2 } from "lucide-react";
import { useSnippetForm } from "../hooks/useSnippetForm";
import { LANGUAGES, getLanguageExtension } from "../constants/languages";
import type { Snippet, Folder } from "../types/snippet";

interface SnippetFormProps {
  snippet?: Snippet | null;
  folders: Folder[];
  onClose: () => void;
}

const SnippetForm: React.FC<SnippetFormProps> = ({
  snippet,
  folders,
  onClose,
}) => {
  const { state, handlers, isPending } = useSnippetForm({ snippet, onClose });
  const { title, language, code, tags, summary, folderId, isAiLoading } = state;
  const {
    setTitle,
    setLanguage,
    setCode,
    setTags,
    setSummary,
    setFolderId,
    handleSubmit,
    handleAiSuggest,
    handleLanguageDetect,
  } = handlers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <FormHeader isEdit={!!snippet} onClose={onClose} />

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-auto p-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormGroup label="Title">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fetch API Wrapper"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormGroup>

            <FormGroup label="Language">
              <div className="flex gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleLanguageDetect}
                  disabled={isAiLoading || !code}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  title="Auto-detect Language"
                >
                  <Wand2
                    className={`h-4 w-4 ${isAiLoading ? "animate-pulse" : ""}`}
                  />
                </button>
              </div>
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormGroup label="Folder">
              <select
                value={folderId || ""}
                onChange={(e) => setFolderId(e.target.value || null)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No Folder (Root)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Tags (comma separated)">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., react, hooks, api"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormGroup>
          </div>

          <FormGroup label="Code">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <CodeMirror
                value={code}
                height="300px"
                extensions={[getLanguageExtension(language)]}
                onChange={(value) => setCode(value)}
                theme="light"
                className="text-sm"
              />
            </div>
          </FormGroup>

          <FormGroup
            label="AI Summary (Optional)"
            action={
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={isAiLoading || !code}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-700 disabled:opacity-50"
              >
                <Sparkles
                  className={`h-3.5 w-3.5 ${isAiLoading ? "animate-spin" : ""}`}
                />
                {isAiLoading ? "Analyzing..." : "Suggest Meta"}
              </button>
            }
          >
            <textarea
              value={summary || ""}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this code does..."
              className="h-24 w-full resize-none rounded-lg border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </FormGroup>
        </form>

        <FormFooter
          onCancel={onClose}
          isPending={isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

const FormHeader: React.FC<{ isEdit: boolean; onClose: () => void }> = ({
  isEdit,
  onClose,
}) => (
  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold text-gray-900">
        {isEdit ? "Edit Snippet" : "Create New Snippet"}
      </h2>
    </div>
    <button
      onClick={onClose}
      className="rounded-full p-2 transition-colors hover:bg-gray-200"
    >
      <X className="h-5 w-5 text-gray-500" />
    </button>
  </div>
);

const FormFooter: React.FC<{
  onCancel: () => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ onCancel, isPending, onSubmit }) => (
  <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-gray-900"
    >
      Cancel
    </button>
    <button
      onClick={onSubmit}
      disabled={isPending}
      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
    >
      <Save className="h-4 w-4" />
      {isPending ? "Saving..." : "Save Snippet"}
    </button>
  </div>
);

const FormGroup: React.FC<{
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ label, children, action }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {action}
    </div>
    {children}
  </div>
);

export default SnippetForm;
