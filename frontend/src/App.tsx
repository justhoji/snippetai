import { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import SnippetList, { type Snippet } from './components/SnippetList';
import SnippetView from './components/SnippetView';

function App() {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  const snippets: Snippet[] = [
    { 
      id: '1', 
      title: 'Fetch API Wrapper', 
      language: 'TypeScript', 
      summary: 'A clean wrapper for the Fetch API with error handling and request/response interceptors.',
      code: 'async function fetchWrapper(url: string, options: RequestInit = {}) {\n  try {\n    const response = await fetch(url, options);\n    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    console.error("Fetch error:", error);\n    throw error;\n  }\n}',
      tags: ['api', 'fetch', 'typescript']
    },
    { 
      id: '2', 
      title: 'Tailwind Button', 
      language: 'CSS', 
      summary: 'Reusable button styles for Tailwind CSS featuring primary and outline variants.',
      code: '.btn {\n  @apply px-4 py-2 rounded-lg font-medium transition-all;\n}\n\n.btn-primary {\n  @apply bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95;\n}\n\n.btn-outline {\n  @apply border border-gray-200 text-gray-600 hover:bg-gray-50;\n}',
      tags: ['ui', 'tailwind', 'buttons']
    },
    { 
      id: '3', 
      title: 'Python Logger', 
      language: 'Python', 
      summary: 'A simple logging configuration for Python projects with rotating file handlers.',
      code: 'import logging\nfrom logging.handlers import RotatingFileHandler\n\ndef setup_logger():\n    logger = logging.getLogger("my_app")\n    logger.setLevel(logging.INFO)\n    \n    handler = RotatingFileHandler("app.log", maxBytes=2000, backupCount=5)\n    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")\n    handler.setFormatter(formatter)\n    \n    logger.addHandler(handler)\n    return logger',
      tags: ['logging', 'python', 'utils']
    },
    { 
      id: '4', 
      title: 'React Hook', 
      language: 'TypeScript', 
      summary: 'A custom hook for managing local storage with synchronization across tabs.',
      code: 'import { useState, useEffect } from "react";\n\nfunction useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n\n  return [storedValue, setStoredValue] as const;\n}',
      tags: ['react', 'hooks', 'storage']
    },
    { 
      id: '5', 
      title: 'Express Middleware', 
      language: 'JavaScript', 
      summary: 'Authentication middleware for Express.js using JWT validation.',
      code: 'const jwt = require("jsonwebtoken");\n\nconst auth = (req, res, next) => {\n  const token = req.header("x-auth-token");\n  if (!token) return res.status(401).send("Access denied. No token provided.");\n\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);\n    req.user = decoded;\n    next();\n  } catch (ex) {\n    res.status(400).send("Invalid token.");\n  }\n};',
      tags: ['auth', 'express', 'middleware']
    },
    { 
      id: '6', 
      title: 'SQL Migration', 
      language: 'SQL', 
      summary: 'A migration script for adding user roles and default permissions.',
      code: 'ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT "user";\n\nUPDATE users SET role = "admin" WHERE email = "admin@example.com";\n\nCREATE TABLE roles (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(50) UNIQUE NOT NULL\n);',
      tags: ['database', 'sql', 'migration']
    },
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <Header />
        {selectedSnippet ? (
          <SnippetView 
            snippet={selectedSnippet} 
            onBack={() => setSelectedSnippet(null)} 
          />
        ) : (
          <SnippetList 
            snippets={snippets} 
            onSelectSnippet={setSelectedSnippet}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
