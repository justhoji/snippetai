import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import type { Snippet } from '../types/snippet';

interface UseSnippetViewProps {
  snippet: Snippet;
  onDelete: () => void;
}

export const useSnippetView = ({ snippet, onDelete }: UseSnippetViewProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => snippetService.delete(snippet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onDelete();
    },
    onError: (error: unknown) => {
      console.error('Delete failed:', error);
      alert('Failed to delete snippet.');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => snippetService.update(snippet.id, { isFavorite: !snippet.isFavorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: (error: unknown) => {
      console.error('Toggle favorite failed:', error);
      alert('Failed to update favorite status.');
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    // Future: Use a proper toast library here
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      deleteMutation.mutate();
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  return {
    actions: {
      handleCopy,
      handleDelete,
      handleToggleFavorite,
    },
    isDeleting: deleteMutation.isPending,
    isUpdatingFavorite: toggleFavoriteMutation.isPending,
  };
};
