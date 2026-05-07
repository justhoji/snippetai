import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "../services/snippetService";
import { userService } from "../services/userService";
import { folderService } from "../services/folderService";
import { tagService } from "../services/tagService";
import type { Snippet } from "../types/snippet";

export type FilterType = "all" | "favorites" | "folder" | "tag";

export const useApp = () => {
  const queryClient = useQueryClient();
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);

  const {
    data: snippets,
    isLoading: snippetsLoading,
    error: snippetsError,
    isFetching: isSnippetsFetching,
  } = useQuery({
    queryKey: ["snippets", searchQuery, isSemanticSearch, filterType, activeId],
    queryFn: () => {
      const params: Record<string, string | boolean | undefined> = {};

      if (isSemanticSearch && searchQuery.trim()) {
        params.q = searchQuery;
        params.semantic = true;
      } else if (searchQuery.trim()) {
        params.q = searchQuery;
      }

      if (filterType === "favorites") params.isFavorite = true;
      if (filterType === "folder" && activeId) params.folderId = activeId;
      if (filterType === "tag" && activeId)
        params.tag = tags?.find((t) => t.id === activeId)?.name;

      return snippetService.getAll(params);
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
  });

  const currentUser = users?.[0] || null;

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ["folders", currentUser?.id],
    queryFn: () => folderService.getAll(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.getAll(),
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) =>
      folderService.create({ name, userId: currentUser!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", currentUser?.id] });
    },
    onError: (error: unknown) => {
      console.error("Create folder failed:", error);
      alert("Failed to create folder.");
    },
  });

  const filteredSnippets = useMemo(() => {
    return snippets || [];
  }, [snippets]);

  const selectedSnippet = useMemo(() => {
    return snippets?.find((s) => s.id === selectedSnippetId) || null;
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

  const isLoading =
    snippetsLoading || usersLoading || foldersLoading || tagsLoading;

  return {
    state: {
      selectedSnippetId,
      selectedSnippet,
      isFormOpen,
      editingSnippet,
      searchQuery,
      isSemanticSearch,
      filteredSnippets,
      currentUser,
      folders,
      tags,
      filterType,
      activeId,
      isLoading: isLoading || isSnippetsFetching,
      snippetsError,
      isCreatingFolder: createFolderMutation.isPending,
    },
    handlers: {
      setSelectedSnippetId,
      setSearchQuery,
      setIsSemanticSearch,
      setFilterType,
      setActiveId,
      handleNewSnippet,
      handleEditSnippet,
      handleFormClose,
      handleCreateFolder: (name: string) => createFolderMutation.mutate(name),
    },
  };
};
