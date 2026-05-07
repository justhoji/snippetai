import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { userService } from '../services/userService';
import { folderService } from '../services/folderService';
import { tagService } from '../services/tagService';
import type { Snippet } from '../types/snippet';

export type FilterType = 'all' | 'favorites' | 'folder' | 'tag';

export const useApp = () => {
  const queryClient = useQueryClient();
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: snippets, isLoading: snippetsLoading, error: snippetsError } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const currentUser = users?.[0] || null;

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', currentUser?.id],
    queryFn: () => folderService.getAll(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getAll(),
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => folderService.create({ name, userId: currentUser!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', currentUser?.id] });
    },
    onError: (error: unknown) => {
      console.error('Create folder failed:', error);
      alert('Failed to create folder.');
    }
  });

  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    
    let filtered = snippets;

    // Category filtering
    if (filterType === 'favorites') {
      filtered = filtered.filter(s => s.isFavorite);
    } else if (filterType === 'folder' && activeId) {
      filtered = filtered.filter(s => s.folderId === activeId);
    } else if (filterType === 'tag' && activeId) {
      filtered = filtered.filter(s => s.tags.some(t => t.id === activeId));
    }

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.language.toLowerCase().includes(query) ||
        s.tags.some(t => t.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [snippets, searchQuery, filterType, activeId]);

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

  const isLoading = snippetsLoading || usersLoading || foldersLoading || tagsLoading;

  return {
    state: {
      selectedSnippetId,
      selectedSnippet,
      isFormOpen,
      editingSnippet,
      searchQuery,
      filteredSnippets,
      currentUser,
      folders,
      tags,
      filterType,
      activeId,
      isLoading,
      snippetsError,
      isCreatingFolder: createFolderMutation.isPending,
    },
    handlers: {
      setSelectedSnippetId,
      setSearchQuery,
      setFilterType,
      setActiveId,
      handleNewSnippet,
      handleEditSnippet,
      handleFormClose,
      handleCreateFolder: (name: string) => createFolderMutation.mutate(name),
    }
  };
};
