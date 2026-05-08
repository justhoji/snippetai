import React, { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    codeToHtml(code, {
      lang: language.toLowerCase(),
      theme: "github-light",
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
      <pre className="min-h-[100px] overflow-auto rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="shiki-container overflow-auto rounded-lg border border-gray-100 text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default CodeBlock;
