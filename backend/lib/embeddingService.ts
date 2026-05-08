import { prisma } from "./prisma";
import { aiService } from "./ai";

export interface SemanticSearchResult {
  id: string;
  similarity: number;
}

/**
 * Service to handle snippet vector embeddings and semantic search.
 */
export const embeddingService = {
  /**
   * Prepares snippet content for embedding generation.
   */
  getEmbeddingText(snippet: {
    title: string;
    language: string;
    code: string;
    summary?: string | null;
  }): string {
    return `Title: ${snippet.title}\nLanguage: ${snippet.language}\nSummary: ${snippet.summary || ""}\nCode:\n${snippet.code}`;
  },

  /**
   * Generates and stores a vector embedding for a snippet.
   */
  async updateSnippetEmbedding(snippet: {
    id: string;
    title: string;
    language: string;
    code: string;
    summary?: string | null;
  }): Promise<void> {
    try {
      const text = this.getEmbeddingText(snippet);
      const embedding = await aiService.generateEmbedding(text);
      const vectorStr = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE "Snippet" SET embedding = $1::vector WHERE id = $2`,
        vectorStr,
        snippet.id,
      );
    } catch (error) {
      console.error(
        `[EmbeddingService] Failed to update embedding for snippet ${snippet.id}:`,
        error,
      );
    }
  },

  /**
   * Performs semantic search using vector similarity.
   */
  async searchSimilarSnippets(
    query: string,
    userId: string,
    threshold = 0.3,
    limit = 20,
  ): Promise<SemanticSearchResult[]> {
    try {
      const embedding = await aiService.generateEmbedding(query);
      const vectorStr = `[${embedding.join(",")}]`;

      const results: SemanticSearchResult[] = await prisma.$queryRawUnsafe(
        `
        SELECT id, 1 - (embedding <=> $1::vector) as similarity
        FROM "Snippet"
        WHERE embedding IS NOT NULL 
          AND "userId" = $2 
          AND 1 - (embedding <=> $1::vector) > $3
        ORDER BY embedding <=> $1::vector
        LIMIT $4
      `,
        vectorStr,
        userId,
        threshold,
        limit,
      );

      return results;
    } catch (error) {
      console.error(`[EmbeddingService] Semantic search failed:`, error);
      return [];
    }
  },
};
