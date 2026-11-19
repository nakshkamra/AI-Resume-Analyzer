import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false));
  }, []);

  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-800 shadow-lg transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} overflow-hidden`}
        >
        <div className="flex flex-col h-full">
          <button
            className="p-2 m-2 text-primary hover:bg-primary/10 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '<' : '>'}
          </button>
          <nav className="flex-1 mt-4 space-y-2">
            <a href="/resume-analyzer" className="block px-4 py-2 hover:bg-primary/10">Resume Analyzer</a>
            <a href="/job-matcher" className="block px-4 py-2 hover:bg-primary/10">Job Matcher</a>
            <a href="/video-academy" className="block px-4 py-2 hover:bg-primary/10">AI Video Academy</a>
            <a href="/interview-coach" className="block px-4 py-2 hover:bg-primary/10">Interview Coach</a>
            <a href="/resume-builder" className="block px-4 py-2 hover:bg-primary/10">Resume Builder</a>
            <a href="/career-roadmap" className="block px-4 py-2 hover:bg-primary/10">Career Roadmap</a>
            <a href="/settings" className="block px-4 py-2 hover:bg-primary/10">Settings</a>
          </nav>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h1>
          <ThemeToggleButton />
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="AI Health" content="Backend reachable" />
          <Card title="Upcoming" content="Feature coming soon" />
          <Card title="Analytics" content="Data will appear here" />
        </section>
      </main>
    </div>
  );
};

const ThemeToggleButton: React.FC = () => {
  const { darkMode, toggleTheme } = React.useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded bg-primary text-white hover:bg-primary/80 transition"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

const Card: React.FC<{title: string; content: string}> = ({title, content}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-md transition">
    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
    <p className="text-gray-600 dark:text-gray-400">{content}</p>
  </div>
);

export default Dashboard;
