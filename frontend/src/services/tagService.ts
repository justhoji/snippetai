import apiClient from "../api/client";
import type { Tag } from "../types/snippet";

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>("/tags");
    return response.data;
  },
};
