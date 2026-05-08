import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "../services/snippetService";
import { aiService } from "../services/aiService";
import type { Snippet, CreateSnippetInput } from "../types/snippet";

interface UseSnippetFormProps {
  snippet?: Snippet | null;
  onClose: () => void;
}

export const useSnippetForm = ({ snippet, onClose }: UseSnippetFormProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(snippet?.title || "");
  const [language, setLanguage] = useState(
    snippet?.language.toLowerCase() || "typescript",
  );
  const [code, setCode] = useState(snippet?.code || "");
  const [tags, setTags] = useState(
    snippet?.tags?.map((t) => t.name).join(", ") || "",
  );
  const [summary, setSummary] = useState(snippet?.summary || "");
  const [folderId, setFolderId] = useState<string | null>(
    snippet?.folderId || null,
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateSnippetInput) => {
      if (snippet) {
        return snippetService.update(snippet.id, data);
      }
      return snippetService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      onClose();
    },
    onError: (err: unknown) => {
      console.error("Save failed:", err);
      const message =
        err instanceof Error ? err.message : "Failed to save snippet";
      setError(message);
    },
  });

  const handleAiSuggest = async () => {
    if (!code) {
      setError("Please enter some code before using AI suggestions.");
      return;
    }

    setError(null);
    setIsAiLoading(true);
    try {
      const suggestions = await aiService.suggestMetadata(code, language);
      setSummary(suggestions.summary);
      setTags(suggestions.tags.join(", "));
    } catch (err) {
      console.error("AI Suggest failed:", err);
      setError(
        "AI failed to generate suggestions. Ensure your OPENAI_API_KEY is configured.",
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLanguageDetect = async () => {
    if (!code) return;
    setIsAiLoading(true);
    setError(null);
    try {
      const detected = await aiService.detectLanguage(code);
      setLanguage(detected);
    } catch (err) {
      console.error("Language detection failed:", err);
      // We don't set a hard error here as it's a "nice to have" feature
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!code.trim()) {
      setError("Code content cannot be empty.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload: CreateSnippetInput = {
      title: title.trim(),
      language,
      code,
      summary,
      isFavorite: snippet?.isFavorite || false,
      folderId,
      tags: tagList,
    };

    mutation.mutate(payload);
  };

  return {
    state: {
      title,
      language,
      code,
      tags,
      summary,
      folderId,
      isAiLoading,
      error,
    },
    handlers: {
      setTitle,
      setLanguage,
      setCode,
      setTags,
      setSummary,
      setFolderId,
      handleSubmit,
      handleAiSuggest,
      handleLanguageDetect,
      clearError: () => setError(null),
    },
    isPending: mutation.isPending,
  };
};
