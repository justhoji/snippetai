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
    onError: (error: unknown) => {
      console.error("Save failed:", error);
      const message =
        error instanceof Error ? error.message : "Failed to save snippet";
      alert(message);
    },
  });

  const handleAiSuggest = async () => {
    if (!code) {
      alert("Please enter some code first.");
      return;
    }

    setIsAiLoading(true);
    try {
      const suggestions = await aiService.suggestMetadata(code, language);
      setSummary(suggestions.summary);
      setTags(suggestions.tags.join(", "));
    } catch (error) {
      console.error("AI Suggest failed:", error);
      alert(
        "AI failed to generate suggestions. Ensure your OPENAI_API_KEY is configured.",
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLanguageDetect = async () => {
    if (!code) return;
    setIsAiLoading(true);
    try {
      const detected = await aiService.detectLanguage(code);
      setLanguage(detected);
    } catch (error) {
      console.error("Language detection failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload: CreateSnippetInput = {
      title,
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
    state: { title, language, code, tags, summary, folderId, isAiLoading },
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
    },
    isPending: mutation.isPending,
  };
};
