import apiClient from "../api/client";
import type {
  Snippet,
  CreateSnippetInput,
  UpdateSnippetInput,
} from "../types/snippet";

export const snippetService = {
  getAll: async (params?: Record<string, unknown>): Promise<Snippet[]> => {
    const response = await apiClient.get<Snippet[]>("/snippets", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Snippet> => {
    const response = await apiClient.get<Snippet>(`/snippets/${id}`);
    return response.data;
  },

  create: async (data: CreateSnippetInput): Promise<Snippet> => {
    const response = await apiClient.post<Snippet>("/snippets", data);
    return response.data;
  },

  update: async (id: string, data: UpdateSnippetInput): Promise<Snippet> => {
    const response = await apiClient.put<Snippet>(`/snippets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/snippets/${id}`);
  },
};
