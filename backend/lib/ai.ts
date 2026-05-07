import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not defined in environment variables.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AISuggestions {
  summary: string;
  tags: string[];
}

export const aiService = {
  async explainCode(code: string, language: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert software engineer. Explain the following ${language} code snippet clearly and concisely. Use markdown formatting.`,
        },
        {
          role: 'user',
          content: code,
        },
      ],
    });

    return response.choices[0].message.content || 'Failed to generate explanation.';
  },

  async suggestMetadata(code: string, language: string): Promise<AISuggestions> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Analyze the following ${language} code and return a JSON object with a brief "summary" (max 2 sentences) and an array of "tags" (max 5 technical keywords). 
          Format: { "summary": "...", "tags": ["tag1", "tag2"] }`,
        },
        {
          role: 'user',
          content: code,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Failed to generate metadata suggestions.');

    return JSON.parse(content) as AISuggestions;
  },

  async detectLanguage(code: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Detect the programming language of the following code. Return ONLY the language name in lowercase (e.g., javascript, python, html).',
        },
        {
          role: 'user',
          content: code.slice(0, 1000), // Only need the first 1000 chars for detection
        },
      ],
    });

    return response.choices[0].message.content?.trim().toLowerCase() || 'javascript';
  },
};
