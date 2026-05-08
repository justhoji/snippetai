import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "../services/snippetService";
import { aiService } from "../services/aiService";
import type { Snippet } from "../types/snippet";

interface UseSnippetViewProps {
  snippet: Snippet;
  onDelete: () => void;
}

export const useSnippetView = ({ snippet, onDelete }: UseSnippetViewProps) => {
  const queryClient = useQueryClient();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => snippetService.delete(snippet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      onDelete();
    },
    onError: (error: unknown) => {
      console.error("Delete failed:", error);
      alert("Failed to delete snippet.");
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () =>
      snippetService.update(snippet.id, { isFavorite: !snippet.isFavorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
    onError: (error: unknown) => {
      console.error("Toggle favorite failed:", error);
      alert("Failed to update favorite status.");
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      deleteMutation.mutate();
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  const handleExplain = async () => {
    if (explanation) {
      setExplanation(null);
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await aiService.explainCode(
        snippet.code,
        snippet.language,
      );
      setExplanation(result);
    } catch (error) {
      console.error("AI Explanation failed:", error);
      alert("Failed to generate explanation. Check your OpenAI API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return {
    state: { explanation, isAiLoading },
    actions: {
      handleCopy,
      handleDelete,
      handleToggleFavorite,
      handleExplain,
      clearExplanation: () => setExplanation(null),
    },
    isDeleting: deleteMutation.isPending,
    isUpdatingFavorite: toggleFavoriteMutation.isPending,
  };
};
