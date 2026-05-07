import Layout from "./components/Layout";
import Header from "./components/Header";
import SnippetList, { type Snippet } from "./components/SnippetList";

function App() {
  const snippets: Snippet[] = [
    {
      id: "1",
      title: "Fetch API Wrapper",
      language: "TypeScript",
      summary: "A clean wrapper for the Fetch API with error handling.",
    },
    {
      id: "2",
      title: "Tailwind Button",
      language: "CSS",
      summary: "Reusable button styles for Tailwind CSS.",
    },
    {
      id: "3",
      title: "Python Logger",
      language: "Python",
      summary: "A simple logging configuration for Python projects.",
    },
    {
      id: "4",
      title: "React Hook",
      language: "TypeScript",
      summary: "A custom hook for managing local storage.",
    },
    {
      id: "5",
      title: "Express Middleware",
      language: "JavaScript",
      summary: "Authentication middleware for Express.js.",
    },
    {
      id: "6",
      title: "SQL Migration",
      language: "SQL",
      summary: "A migration script for adding user roles.",
    },
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <Header />
        <SnippetList snippets={snippets} />
      </div>
    </Layout>
  );
}

export default App;
