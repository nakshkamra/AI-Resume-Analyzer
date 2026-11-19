import React, { useContext } from 'react'; 
import { ThemeContext } from '../ThemeContext';

export default function Settings() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Appearance</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Toggle between Light and Dark mode. Current mode: {darkMode ? 'Dark' : 'Light'}
        </p>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </section>
    </main>
  );
}

