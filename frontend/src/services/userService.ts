import apiClient from "../api/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  },
};
