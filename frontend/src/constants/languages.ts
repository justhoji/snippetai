import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { sql } from '@codemirror/lang-sql';

export const LANGUAGES = [
  { label: 'TypeScript', value: 'typescript', extension: javascript({ typescript: true }) },
  { label: 'JavaScript', value: 'javascript', extension: javascript() },
  { label: 'Python', value: 'python', extension: python() },
  { label: 'HTML', value: 'html', extension: html() },
  { label: 'SQL', value: 'sql', extension: sql() },
];

export const getLanguageExtension = (langValue: string) => {
  return LANGUAGES.find(l => l.value === langValue.toLowerCase())?.extension || LANGUAGES[0].extension;
};
