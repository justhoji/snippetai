import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    
    codeToHtml(code, {
      lang: language.toLowerCase(),
      theme: 'github-light',
    }).then((highlighted) => {
      if (isMounted) {
        setHtml(highlighted);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  if (!html) {
    return (
      <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-sm border border-gray-100 min-h-[100px]">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div 
      className="shiki-container rounded-lg overflow-auto border border-gray-100 text-sm"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default CodeBlock;
