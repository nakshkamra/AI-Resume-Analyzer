import React, { useState, useEffect } from 'react';
import { lessons, Lesson } from '../data/lessons';
import { Search, CheckCircle, Circle, XCircle } from 'lucide-react';

const VideoAcademy: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [completed, setCompleted] = useState<string[]>([]);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      try { setCompleted(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Persist when changed
  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completed));
  }, [completed]);

  const toggleComplete = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.skill.toLowerCase().includes(search.toLowerCase());
    const matchesLang = filterLang === 'All' || l.language === filterLang;
    const matchesDiff = filterDiff === 'All' || l.difficulty === filterDiff;
    return matchesSearch && matchesLang && matchesDiff;
  });

  const languages = Array.from(new Set(lessons.map(l => l.language)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 flex items-center"><Search className="mr-2"/>Video Academy</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded p-2 flex-1" />
        <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="border rounded p-2">
          <option>All</option>
          {languages.map(lang => <option key={lang}>{lang}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="border rounded p-2">
          <option>All</option>
          {difficulties.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Lesson list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lesson: Lesson) => (
          <li key={lesson.id} className="border rounded p-4 bg-white dark:bg-gray-800 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-1">{lesson.title}</h2>
              <p className="text-sm mb-1"><strong>Language:</strong> {lesson.language} | <strong>Skill:</strong> {lesson.skill} | <strong>Difficulty:</strong> {lesson.difficulty}</p>
              <a href={lesson.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Watch video</a>
            </div>
            <button onClick={() => toggleComplete(lesson.id)} className="mt-2 self-start flex items-center text-sm">
              {completed.includes(lesson.id) ? <CheckCircle className="text-green-500 mr-1"/> : <Circle className="text-gray-400 mr-1"/>}
              {completed.includes(lesson.id) ? 'Completed' : 'Mark as completed'}
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="col-span-full text-center text-gray-500">No lessons match your filters.</li>}
      </ul>
    </div>
  );
};

export default VideoAcademy;
