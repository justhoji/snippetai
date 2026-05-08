export interface Tag {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  summary: string | null;
  isFavorite: boolean;
  folderId: string | null;
  userId: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedSnippets {
  snippets: Snippet[];
  pagination: Pagination;
}

export type CreateSnippetInput = Omit<
  Snippet,
  "id" | "tags" | "userId" | "createdAt" | "updatedAt"
> & {
  tags?: string[];
};

export type UpdateSnippetInput = Partial<CreateSnippetInput>;
