import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Clock3, FileSearch, History, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

type HistoryEntry = { id: number; resume_name: string; job_title: string; match_score: number | null; quality_score: number; matched_skills: string[]; missing_skills: string[]; analyzed_at: string };
type Filter = 'all' | 'resume' | 'match';

const AnalysisHistory: React.FC = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetch('/api/history')
      .then(async (response) => { if (!response.ok) throw new Error('Could not load analysis history.'); return response.json(); })
      .then(setEntries)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const isMatch = entry.match_score !== null;
    const matchesFilter = filter === 'all' || (filter === 'match' ? isMatch : !isMatch);
    const haystack = `${entry.resume_name} ${entry.job_title} ${entry.matched_skills.join(' ')} ${entry.missing_skills.join(' ')}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  }), [entries, filter, query]);

  return (
    <FeatureShell eyebrow="Your activity" title="Analysis history" description="A private record of your resume reviews and role comparisons, saved from this workspace." icon={History}>
      {error && <div className="cf-alert" role="alert">{error}</div>}
      <section className="cf-card cf-card-pad">
        <div className="cf-toolbar">
          <SectionTitle icon={Clock3} title="Recent activity" aside={<span className="cf-history-total">{entries.length} {entries.length === 1 ? 'record' : 'records'}</span>} />
          <div className="cf-filter-row" role="group" aria-label="Filter history">
            {([['all', 'All activity'], ['resume', 'Resume reviews'], ['match', 'Role matches']] as const).map(([key, label]) => <button key={key} type="button" className="cf-filter" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}
          </div>
        </div>
        <label className="cf-search-field"><Search size={16} /><input aria-label="Search analysis history" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by resume, skill, or analysis type" /></label>

        {loading && <div className="cf-list-skeleton" aria-label="Loading history"><span /><span /><span /></div>}
        {!loading && !error && entries.length === 0 && <div className="cf-empty-state"><span className="cf-icon-box"><History size={20} /></span><h2>No analyses saved yet</h2><p>When you analyze a resume or compare it with a role, the result will be collected here.</p><div className="cf-empty-links"><Link className="cf-secondary-button" to="/resume-analyzer">Analyze a resume <ArrowRight size={14} /></Link><Link className="cf-quiet-button" to="/job-matcher">Compare a role</Link></div></div>}
        {!loading && !error && entries.length > 0 && filteredEntries.length === 0 && <div className="cf-empty-filter">No records match this search and filter.</div>}
        {!loading && !error && filteredEntries.map((entry) => {
          const isMatch = entry.match_score !== null;
          return (
            <article className="cf-history-row" key={entry.id}>
              <div className="cf-history-main">
                <span className={`cf-history-kind${isMatch ? ' match' : ''}`}>{isMatch ? <Target size={13} /> : <FileSearch size={13} />}{isMatch ? 'Role match' : 'Resume review'}</span>
                <h3>{entry.job_title}</h3>
                <p>{entry.resume_name} <span>·</span> {entry.analyzed_at}</p>
                <details className="cf-accordion">
                  <summary>Open result details</summary>
                  <div className="cf-history-details">
                    <div><strong>Skills detected</strong><div className="cf-pill-list">{entry.matched_skills.length ? entry.matched_skills.map((skill) => <span className="cf-pill" key={skill}>{skill}</span>) : <span className="cf-small-label">None recorded</span>}</div></div>
                    {isMatch && <div><strong>Potential skill gaps</strong><div className="cf-pill-list">{entry.missing_skills.length ? entry.missing_skills.map((skill) => <span className="cf-pill cf-pill-missing" key={skill}>{skill}</span>) : <span className="cf-small-label">None recorded</span>}</div></div>}
                  </div>
                </details>
              </div>
              <div className="cf-history-scores">
                <span><small>Resume</small><strong>{entry.quality_score}%</strong></span>
                {isMatch && <span><small>Match</small><strong className="accent">{entry.match_score}%</strong></span>}
              </div>
            </article>
          );
        })}
      </section>
      <p className="cf-footer-note"><Check size={13} /> History contains analysis summaries and skill lists; resume files themselves are not saved.</p>
    </FeatureShell>
  );
};

export default AnalysisHistory;
