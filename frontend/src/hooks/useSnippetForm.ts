import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import type { Snippet, CreateSnippetInput } from '../types/snippet';

interface UseSnippetFormProps {
  snippet?: Snippet | null;
  userId?: string;
  onClose: () => void;
}

export const useSnippetForm = ({ snippet, userId, onClose }: UseSnippetFormProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(snippet?.title || '');
  const [language, setLanguage] = useState(snippet?.language.toLowerCase() || 'typescript');
  const [code, setCode] = useState(snippet?.code || '');
  const [tags, setTags] = useState(snippet?.tags.map(t => t.name).join(', ') || '');
  const [summary, setSummary] = useState(snippet?.summary || '');

  const mutation = useMutation({
    mutationFn: (data: CreateSnippetInput) => {
      if (snippet) {
        return snippetService.update(snippet.id, data);
      }
      return snippetService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onClose();
    },
    onError: (error: unknown) => {
      console.error('Save failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to save snippet';
      alert(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId && !snippet?.userId) {
      alert('Error: No active user found. Please ensure at least one user exists in the database.');
      return;
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    
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

  return {
    state: { title, language, code, tags, summary },
    handlers: { setTitle, setLanguage, setCode, setTags, setSummary, handleSubmit },
    isPending: mutation.isPending,
  };
};
