import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "../services/snippetService";
import { folderService } from "../services/folderService";
import { tagService } from "../services/tagService";
import { useAuth } from "../context/AuthContext";
import type { Snippet } from "../types/snippet";

export type FilterType = "all" | "favorites" | "folder" | "tag";

export const useApp = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

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
    enabled: !!currentUser,
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: () => folderService.getAll(""),
    enabled: !!currentUser,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.getAll(),
    enabled: !!currentUser,
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => folderService.create({ name, userId: "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: unknown) => {
      console.error("Create folder failed:", error);
      alert("Failed to create folder.");
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      folderService.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: unknown) => {
      console.error("Rename folder failed:", error);
      alert("Failed to rename folder.");
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => folderService.delete(id),
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      if (activeId === folderId && filterType === "folder") {
        setFilterType("all");
        setActiveId(null);
      }
    },
    onError: (error: unknown) => {
      console.error("Delete folder failed:", error);
      alert("Failed to delete folder.");
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

  const isLoading = snippetsLoading || foldersLoading || tagsLoading;

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
      isLoading: (isLoading || isSnippetsFetching) && !!currentUser,
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
      handleRenameFolder: (id: string, name: string) =>
        updateFolderMutation.mutate({ id, name }),
      handleDeleteFolder: (id: string) => deleteFolderMutation.mutate(id),
    },
  };
};
