import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  Briefcase,
  Video,
  MessageSquare,
  FileEdit,
  MapPin,
  Settings,
  History,
  Sun,
  Moon,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setBackendOk(data.status === 'ok'))
      .catch(() => setBackendOk(false));
  }, []);

  const menuItems = [
    { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/job-matcher', label: 'Job Matcher', icon: Briefcase },
    { to: '/video-academy', label: 'AI Video Academy', icon: Video },
    { to: '/interview-coach', label: 'Interview Coach', icon: MessageSquare },
    { to: '/resume-builder', label: 'Resume Builder', icon: FileEdit },
    { to: '/career-roadmap', label: 'Career Roadmap', icon: MapPin },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/analysis-history', label: 'Analysis History', icon: History },
  ];
  const descriptions: Record<string, string> = {
    '/resume-analyzer': 'Upload and analyze your resume to get AI-driven feedback and suggestions.',
    '/job-matcher': 'Match your profile with relevant job listings using AI.',
    '/video-academy': 'Learn programming concepts via curated video lessons.',
    '/interview-coach': 'Practice technical interviews with AI-generated questions.',
    '/resume-builder': 'Create a professional resume with AI assistance.',
    '/career-roadmap': 'Generate a personalized career roadmap and track progress.',
    '/settings': 'Customize your app experience, including theme and preferences.',
    '/analysis-history': 'Review your saved resume analyses and job matches.',
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 shadow-lg transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <button
            className="p-2 m-2 text-primary hover:bg-primary/10 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '<' : '>'}
          </button>
          <nav className="flex-1 mt-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center px-4 py-2 hover:bg-primary/10 transition"
                >
                  <Icon className="w-5 h-5 mr-2 text-primary" />
                  {sidebarOpen && <span className="text-gray-800 dark:text-gray-200">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        {/* Top navigation */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 mr-1" /> : <Moon className="w-5 h-5 mr-1" />}
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </header>

        {/* Backend health status */}
        <section className="mb-4">
          {backendOk === null && <p className="text-gray-500">Checking backend…</p>}
          {backendOk === true && <p className="text-green-600">Backend reachable ✅</p>}
          {backendOk === false && <p className="text-red-600">Backend unreachable ⚠️</p>}
        </section>

        {/* Feature cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-3">
                <item.icon className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.label}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{descriptions[item.to]}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
