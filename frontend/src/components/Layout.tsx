import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onNewSnippet: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onNewSnippet }) => {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Sidebar onNewSnippet={onNewSnippet} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
