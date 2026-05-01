import React, { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then(res => res.ok ? setStatus('online') : setStatus('offline'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`h-3 w-3 rounded-full ${
            status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
            status === 'offline' ? 'bg-red-500' : 'bg-gray-300 animate-pulse'
          }`} />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Backend: {status}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-6xl">
          AI Powered Code Vault
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Your personal second brain for code snippets. Store, search, and explain code with AI.
        </p>
      </header>
      
      <main className="mt-10 w-full max-w-4xl">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 italic">
            Ready to build? Start by adding your first snippet or setting up the database.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              New Snippet
            </button>
            <button className="px-5 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              View Vault
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-gray-400 text-sm">
        Built with Bun, Express, React & Tailwind
      </footer>
    </div>
  )
}

export default App
