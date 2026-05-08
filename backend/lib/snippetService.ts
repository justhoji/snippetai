import { prisma } from "./prisma";
import { embeddingService } from "./embeddingService";

const SNIPPET_INCLUDE = {
  tags: true,
  folder: true,
} as const;

export interface SnippetFilters {
  q?: string;
  language?: string;
  folderId?: string | null;
  tag?: string;
  isFavorite?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const snippetService = {
  async getSnippets(userId: string, filters: SnippetFilters) {
    const {
      q,
      language,
      folderId,
      tag,
      isFavorite,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = filters;

    const where: any = { userId };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    if (language) where.language = language;
    if (folderId !== undefined) where.folderId = folderId;
    if (isFavorite !== undefined) where.isFavorite = isFavorite;
    if (tag) {
      where.tags = { some: { name: tag } };
    }

    const skip = (page - 1) * limit;

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        where,
        include: SNIPPET_INCLUDE,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.snippet.count({ where }),
    ]);

    return {
      snippets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getSemanticSnippets(userId: string, query: string) {
    const results = await embeddingService.searchSimilarSnippets(query, userId);

    if (results.length === 0) {
      return {
        snippets: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    }

    const ids = results.map((r) => r.id);
    const snippets = await prisma.snippet.findMany({
      where: { id: { in: ids } },
      include: SNIPPET_INCLUDE,
    });

    const sortedSnippets = ids
      .map((id) => {
        const snippet = snippets.find((s) => s.id === id);
        const result = results.find((r) => r.id === id);
        if (!snippet) return null;
        return { ...snippet, similarity: result?.similarity };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return {
      snippets: sortedSnippets,
      pagination: {
        total: sortedSnippets.length,
        page: 1,
        limit: sortedSnippets.length,
        totalPages: 1,
      },
    };
  },

  async getSnippetById(id: string, userId: string) {
    return prisma.snippet.findFirst({
      where: { id, userId },
      include: SNIPPET_INCLUDE,
    });
  },

  async createSnippet(
    userId: string,
    data: {
      title: string;
      language: string;
      code: string;
      summary?: string;
      isFavorite?: boolean;
      folderId?: string | null;
      tags?: string[];
    },
  ) {
    const { tags, ...rest } = data;

    const snippet = await prisma.snippet.create({
      data: {
        ...rest,
        userId,
        tags: {
          connectOrCreate: tags?.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: SNIPPET_INCLUDE,
    });

    embeddingService.updateSnippetEmbedding(snippet);

    return snippet;
  },

  async updateSnippet(
    id: string,
    userId: string,
    data: {
      title?: string;
      language?: string;
      code?: string;
      summary?: string;
      isFavorite?: boolean;
      folderId?: string | null;
      tags?: string[];
    },
  ) {
    const existingSnippet = await prisma.snippet.findFirst({
      where: { id, userId },
    });

    if (!existingSnippet) return null;

    const { tags, ...rest } = data;

    const updatedSnippet = await prisma.snippet.update({
      where: { id },
      data: {
        ...rest,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: SNIPPET_INCLUDE,
    });

    if (rest.title || rest.language || rest.code || rest.summary !== undefined) {
      embeddingService.updateSnippetEmbedding(updatedSnippet);
    }

    return updatedSnippet;
  },

  async deleteSnippet(id: string, userId: string) {
    const snippet = await prisma.snippet.findFirst({
      where: { id, userId },
    });

    if (!snippet) return null;

    await prisma.snippet.delete({ where: { id } });
    return true;
  },
};
