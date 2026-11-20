import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Circle, ExternalLink, Search, Video } from 'lucide-react';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';
import { Lesson, lessons } from '../data/lessons';

const VideoAcademy: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('completedLessons');
      if (saved) setCompleted(JSON.parse(saved));
    } catch {
      setCompleted([]);
    }
  }, []);

  useEffect(() => { localStorage.setItem('completedLessons', JSON.stringify(completed)); }, [completed]);

  const languages = Array.from(new Set(lessons.map((lesson) => lesson.language)));
  const filteredLessons = useMemo(() => lessons.filter((lesson) => {
    const query = search.toLowerCase();
    return `${lesson.title} ${lesson.skill} ${lesson.language}`.toLowerCase().includes(query)
      && (filterLanguage === 'All' || lesson.language === filterLanguage)
      && (filterDifficulty === 'All' || lesson.difficulty === filterDifficulty);
  }), [search, filterLanguage, filterDifficulty]);

  const toggleCompleted = (id: string) => setCompleted((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id]);

  return (
    <FeatureShell eyebrow="Learning studio" title="Grow skills at your pace" description="Find focused lessons, filter by language and level, and mark progress to connect learning with your career roadmap." icon={Video}>
      <section className="cf-card cf-card-pad">
        <SectionTitle icon={BookOpen} title="Lesson library" aside={<span className="cf-small-label">{completed.length} completed</span>} />
        <div className="cf-two-col" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(150px, 1fr) minmax(150px, 1fr)' }}>
          <label className="cf-field-label">Search lessons<input className="cf-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by topic or skill" /></label>
          <label className="cf-field-label">Language<select className="cf-select" value={filterLanguage} onChange={(event) => setFilterLanguage(event.target.value)}><option>All</option>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
          <label className="cf-field-label">Level<select className="cf-select" value={filterDifficulty} onChange={(event) => setFilterDifficulty(event.target.value)}><option>All</option>{(['Beginner', 'Intermediate', 'Advanced'] as Lesson['difficulty'][]).map((level) => <option key={level}>{level}</option>)}</select></label>
        </div>
        <div className="cf-academy-lower cf-two-col">
          {filteredLessons.map((lesson) => {
            const isComplete = completed.includes(lesson.id);
            return <article className="cf-skill-panel" key={lesson.id}>
              <div className="cf-toolbar"><span className="cf-report-badge">{lesson.language}</span><span className="cf-small-label">{lesson.difficulty}</span></div>
              <h2 style={{ margin: '16px 0 6px', fontSize: 16 }}>{lesson.title}</h2>
              <p className="cf-muted">Skill focus: {lesson.skill}</p>
              <div className="cf-toolbar" style={{ marginTop: 16 }}>
                <a className="cf-secondary-button" href={lesson.url} target="_blank" rel="noreferrer">Watch lesson <ExternalLink size={14} /></a>
                <button className="cf-quiet-button" type="button" onClick={() => toggleCompleted(lesson.id)} aria-pressed={isComplete}>{isComplete ? <CheckCircle2 size={15} /> : <Circle size={15} />}{isComplete ? 'Completed' : 'Mark complete'}</button>
              </div>
            </article>;
          })}
        </div>
        {!filteredLessons.length && <div className="cf-empty-state"><Search size={20} /><h2>No lessons found</h2><p>Try another search or clear one of the filters.</p></div>}
      </section>
    </FeatureShell>
  );
};

export default VideoAcademy;
