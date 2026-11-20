import React, { FormEvent, useState } from 'react';
import { ArrowRight, Check, FileSearch, Lightbulb, Loader2, Plus, Sparkles, Target, X } from 'lucide-react';
import { FeatureShell, ScoreRing, SectionTitle } from '../components/FeatureShell';
import ResumeDropzone from '../components/ResumeDropzone';

type MatchResult = { match_percentage: number; matched_skills: string[]; missing_skills: string[]; recommendations: string[]; explanation: string };

const JobMatcher: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!resumeFile) { setError('Add a PDF or DOCX resume to compare.'); return; }
    if (!jobDesc.trim()) { setError('Paste the job description you want to compare against.'); return; }
    setLoading(true); setError(''); setResult(null);
    const formData = new FormData(); formData.append('resume_file', resumeFile); formData.append('job_description', jobDesc);
    try {
      const response = await fetch('/api/jobs/match', { method: 'POST', body: formData });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || 'We could not compare these inputs. Please try again.');
      }
      setResult(await response.json());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The service could not be reached. Check that the API is running.');
    } finally { setLoading(false); }
  };

  return (
    <FeatureShell eyebrow="Role matching" title="Find your fit" description="Compare your resume with a role description to see which listed skills align and where there may be gaps." icon={Target}>
      {error && <div className="cf-alert" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="cf-two-col cf-match-inputs">
          <section className="cf-card cf-card-pad">
            <SectionTitle icon={FileSearch} title="Your resume" aside={<span className="cf-small-label">Step 1</span>} />
            <ResumeDropzone file={resumeFile} onFile={(nextFile) => { setResumeFile(nextFile); setError(''); }} onRejected={setError} />
          </section>
          <section className="cf-card cf-card-pad">
            <SectionTitle icon={Target} title="Target role" aside={<span className="cf-small-label">Step 2</span>} />
            <label className="cf-field-label" htmlFor="job-description">Job description</label>
            <textarea id="job-description" className="cf-textarea" value={jobDesc} onChange={(event) => setJobDesc(event.target.value)} placeholder="Paste the role description here. Include responsibilities and required skills for a more useful comparison." />
            <div className="cf-char-count">{jobDesc.trim() ? jobDesc.trim().split(/\s+/).length : 0} words · Your text stays in this session</div>
          </section>
        </div>
        <div className="cf-match-submit-row">
          <p className="cf-muted">We compare skills detected in your resume with skills recognized in the role text.</p>
          <button type="submit" className="cf-primary-button" disabled={loading || !resumeFile || !jobDesc.trim()}>
            {loading ? <><Loader2 size={16} className="cf-spin" /> Comparing…</> : <>Match this role <ArrowRight size={16} /></>}
          </button>
        </div>
      </form>
      {result ? (
        <section className="cf-card cf-card-pad cf-match-results">
          <div className="cf-toolbar"><SectionTitle icon={Sparkles} title="Your match report" /><span className="cf-report-badge">Role comparison</span></div>
          <div className="cf-match-summary">
            <div className="cf-card cf-metric-card"><ScoreRing score={result.match_percentage} label="Skill match" caption={result.explanation} /></div>
            <div className="cf-match-overview">
              <h2>Role alignment</h2>
              <p>{result.explanation}</p>
              <div className="cf-match-bar-label"><span>Recognized skill overlap</span><strong>{Math.round(result.match_percentage)}%</strong></div>
              <div className="cf-progress-track"><span style={{ width: `${Math.min(100, Math.max(0, result.match_percentage))}%` }} /></div>
              <p className="cf-compact-note">This percentage reflects skill overlap only. Experience and seniority compatibility are not scored by the current matcher.</p>
            </div>
          </div>
          <div className="cf-two-col cf-skill-comparison">
            <div className="cf-skill-panel"><SectionTitle icon={Check} title="Skills in both" aside={<span className="cf-count-badge">{result.matched_skills.length}</span>} />{result.matched_skills.length ? <div className="cf-pill-list">{result.matched_skills.map((skill) => <span className="cf-pill cf-pill-positive" key={skill}><Check size={12} />{skill}</span>)}</div> : <p className="cf-muted">No overlaps found from the skill list currently checked.</p>}</div>
            <div className="cf-skill-panel"><SectionTitle icon={Plus} title="Skills to consider" aside={<span className="cf-count-badge">{result.missing_skills.length}</span>} />{result.missing_skills.length ? <div className="cf-pill-list">{result.missing_skills.map((skill) => <span className="cf-pill cf-pill-missing" key={skill}><X size={12} />{skill}</span>)}</div> : <p className="cf-muted">No recognized skill gaps in this comparison.</p>}</div>
          </div>
          <div className="cf-result-section"><SectionTitle icon={Lightbulb} title="Ideas for your next edit" />{result.recommendations.length ? <ul className="cf-insight-list">{result.recommendations.map((recommendation, index) => <li key={`${index}-${recommendation}`}><Sparkles size={15} />{recommendation}</li>)}</ul> : <div className="cf-alert cf-alert-success"><Check size={15} /> No skill recommendations were returned for this role.</div>}</div>
        </section>
      ) : (
        <section className="cf-card cf-empty-state cf-match-empty"><span className="cf-icon-box"><Target size={20} /></span><h2>{loading ? 'Comparing your profile' : 'Your role comparison will appear here'}</h2><p>{loading ? 'Checking skills between the resume and the description.' : 'Add both inputs above to see skill overlap, potential gaps, and role-specific suggestions.'}</p>{loading && <div className="cf-loading-bar"><span /></div>}</section>
      )}
    </FeatureShell>
  );
};

export default JobMatcher;
