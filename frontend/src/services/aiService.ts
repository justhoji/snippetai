import client from '../api/client';

export interface AISuggestions {
  summary: string;
  tags: string[];
}

export const aiService = {
  async explainCode(code: string, language?: string): Promise<string> {
    const { data } = await client.post<{ explanation: string }>('/ai/explain', { code, language });
    return data.explanation;
  },

  async suggestMetadata(code: string, language?: string): Promise<AISuggestions> {
    const { data } = await client.post<AISuggestions>('/ai/suggest-meta', { code, language });
    return data;
  },

  async detectLanguage(code: string): Promise<string> {
    const { data } = await client.post<{ language: string }>('/ai/detect-language', { code });
    return data.language;
  },
};
