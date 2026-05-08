import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { sql } from '@codemirror/lang-sql';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { yaml } from '@codemirror/lang-yaml';

export const LANGUAGES = [
  { label: 'TypeScript', value: 'typescript', extension: javascript({ typescript: true }) },
  { label: 'JavaScript', value: 'javascript', extension: javascript() },
  { label: 'Python', value: 'python', extension: python() },
  { label: 'Java', value: 'java', extension: java() },
  { label: 'C++', value: 'cpp', extension: cpp() },
  { label: 'Rust', value: 'rust', extension: rust() },
  { label: 'Go', value: 'go', extension: go() },
  { label: 'PHP', value: 'php', extension: php() },
  { label: 'HTML', value: 'html', extension: html() },
  { label: 'CSS', value: 'css', extension: css() },
  { label: 'SQL', value: 'sql', extension: sql() },
  { label: 'JSON', value: 'json', extension: json() },
  { label: 'Markdown', value: 'markdown', extension: markdown() },
  { label: 'YAML', value: 'yaml', extension: yaml() },
];

export const getLanguageExtension = (langValue: string) => {
  return LANGUAGES.find(l => l.value === langValue.toLowerCase())?.extension || LANGUAGES[0].extension;
};
