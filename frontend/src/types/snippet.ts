export interface Tag {
  id: string;
  name: string;
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

export type CreateSnippetInput = Omit<Snippet, 'id' | 'tags' | 'createdAt' | 'updatedAt'> & {
  tags?: string[];
};

export type UpdateSnippetInput = Partial<CreateSnippetInput>;
