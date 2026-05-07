import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { userService } from '../services/userService';
import type { Snippet } from '../types/snippet';

export const useApp = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: snippets, isLoading: snippetsLoading, error: snippetsError } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const currentUser = users?.[0] || null;

  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    if (!searchQuery.trim()) return snippets;

    const query = searchQuery.toLowerCase();
    return snippets.filter(s => 
      s.title.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.language.toLowerCase().includes(query) ||
      s.tags.some(t => t.name.toLowerCase().includes(query))
    );
  }, [snippets, searchQuery]);

  const selectedSnippet = useMemo(() => {
    return snippets?.find(s => s.id === selectedSnippetId) || null;
  }, [snippets, selectedSnippetId]);

  const handleNewSnippet = () => {
    setEditingSnippet(null);
    setIsFormOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSnippet(null);
  };

  const isLoading = snippetsLoading || usersLoading;

  return {
    state: {
      selectedSnippetId,
      selectedSnippet,
      isFormOpen,
      editingSnippet,
      searchQuery,
      filteredSnippets,
      currentUser,
      isLoading,
      snippetsError
    },
    handlers: {
      setSelectedSnippetId,
      setSearchQuery,
      handleNewSnippet,
      handleEditSnippet,
      handleFormClose,
    }
  };
};
