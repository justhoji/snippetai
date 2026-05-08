import apiClient from "../api/client";
import type { Folder } from "../types/snippet";

export const folderService = {
  getAll: async (userId: string): Promise<Folder[]> => {
    const response = await apiClient.get<Folder[]>(`/folders?userId=${userId}`);
    return response.data;
  },
  create: async (data: { name: string; userId: string }): Promise<Folder> => {
    const response = await apiClient.post<Folder>("/folders", data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/folders/${id}`);
  },
};
