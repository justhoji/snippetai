import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { X, Save } from 'lucide-react';
import { useSnippetForm } from '../hooks/useSnippetForm';
import { LANGUAGES, getLanguageExtension } from '../constants/languages';
import type { Snippet, Folder } from '../types/snippet';

interface SnippetFormProps {
  snippet?: Snippet | null;
  userId?: string;
  folders: Folder[];
  onClose: () => void;
}

const SnippetForm: React.FC<SnippetFormProps> = ({ snippet, userId, folders, onClose }) => {
  const { state, handlers, isPending } = useSnippetForm({ snippet, userId, onClose });
  const { title, language, code, tags, summary, folderId } = state;
  const { setTitle, setLanguage, setCode, setTags, setSummary, setFolderId, handleSubmit } = handlers;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <FormHeader 
          isEdit={!!snippet} 
          onClose={onClose} 
        />

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Title">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fetch API Wrapper"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </FormGroup>

            <FormGroup label="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Folder">
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">No Folder (Root)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Tags (comma separated)">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., react, hooks, api"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </FormGroup>
          </div>

          <FormGroup label="Code">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
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

          <FormGroup label="AI Summary (Optional)">
            <textarea
              value={summary || ''}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this code does..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
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

const FormHeader: React.FC<{ isEdit: boolean; onClose: () => void }> = ({ isEdit, onClose }) => (
  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
    <h2 className="text-xl font-bold text-gray-900">
      {isEdit ? 'Edit Snippet' : 'Create New Snippet'}
    </h2>
    <button 
      onClick={onClose}
      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
    >
      <X className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);

const FormFooter: React.FC<{ onCancel: () => void; isPending: boolean; onSubmit: (e: React.FormEvent) => void }> = ({ onCancel, isPending, onSubmit }) => (
  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={onSubmit}
      disabled={isPending}
      className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
    >
      <Save className="w-4 h-4" />
      {isPending ? 'Saving...' : 'Save Snippet'}
    </button>
  </div>
);

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    {children}
  </div>
);

export default SnippetForm;
