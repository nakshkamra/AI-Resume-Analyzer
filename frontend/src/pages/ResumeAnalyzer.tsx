import React, { FormEvent, useState } from 'react';
import { ArrowRight, BadgeCheck, Check, FileSearch, Lightbulb, Loader2, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, ScoreRing, SectionTitle } from '../components/FeatureShell';
import ResumeDropzone from '../components/ResumeDropzone';

type AnalysisResult = { skills: string[]; sections_found: string[]; score: number; suggestions: string[] };

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) { setError('Add a PDF or DOCX resume before starting your review.'); return; }
    setLoading(true); setError(''); setResult(null);
    const formData = new FormData(); formData.append('file', file);
    try {
      const response = await fetch('/api/resume/analyze', { method: 'POST', body: formData });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || 'We could not analyze this resume. Please try another file.');
      }
      setResult(await response.json());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The service could not be reached. Check that the API is running.');
    } finally { setLoading(false); }
  };

  return (
    <FeatureShell eyebrow="Resume intelligence" title="Resume analyzer" description="Get a clear read on the skills and sections in your resume, with practical ways to strengthen it." icon={FileSearch}>
      {error && <div className="cf-alert" role="alert">{error}</div>}
      <div className="cf-two-col">
        <section className="cf-card cf-card-pad">
          <SectionTitle icon={FileSearch} title="Your resume" aside={<span className="cf-small-label">PDF or DOCX</span>} />
          <form onSubmit={handleSubmit}>
            <ResumeDropzone file={file} onFile={(nextFile) => { setFile(nextFile); setError(''); }} onRejected={setError} />
            <button type="submit" className="cf-primary-button" disabled={loading || !file} style={{ width: '100%', marginTop: 16 }}>
              {loading ? <><Loader2 size={16} className="cf-spin" /> Reviewing resume…</> : <>Analyze resume <ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="cf-footer-note">Your resume is processed locally by this service and the original file is discarded after parsing.</p>
        </section>
        <section className="cf-card cf-card-pad">
          {result ? (
            <>
              <SectionTitle icon={Sparkles} title="Review snapshot" />
              <div className="cf-result-grid">
                <div className="cf-card cf-metric-card"><ScoreRing score={result.score} label="Resume score" caption="Based on the current resume quality checks." /></div>
                <div className="cf-result-details">
                  <div className="cf-result-stat"><span className="cf-icon-box"><Target size={17} /></span><div><strong>{result.skills.length}</strong><small>skills detected</small></div></div>
                  <div className="cf-result-stat"><span className="cf-icon-box"><BadgeCheck size={17} /></span><div><strong>{result.sections_found.length}</strong><small>recognized sections</small></div></div>
                  <div className="cf-divider" />
                  <p className="cf-field-label">Recognized sections</p>
                  <div className="cf-pill-list">{result.sections_found.length ? result.sections_found.map((section) => <span className="cf-pill cf-pill-positive" key={section}><Check size={12} />{section}</span>) : <span className="cf-muted">No standard sections were detected.</span>}</div>
                </div>
              </div>
              <div className="cf-result-section">
                <SectionTitle icon={Target} title="Skills found" aside={<span className="cf-small-label">{result.skills.length} detected</span>} />
                {result.skills.length ? <div className="cf-pill-list">{result.skills.map((skill) => <span className="cf-pill" key={skill}>{skill}</span>)}</div> : <p className="cf-muted">No skills from the current skill list were detected.</p>}
              </div>
              <div className="cf-result-section">
                <SectionTitle icon={Lightbulb} title="Ways to improve" />
                {result.suggestions.length ? <ul className="cf-insight-list">{result.suggestions.map((tip, index) => <li key={`${index}-${tip}`}><Sparkles size={15} />{tip}</li>)}</ul> : <div className="cf-alert cf-alert-success"><Check size={15} /> No improvement suggestions were returned by this review.</div>}
              </div>
              <div className="cf-compact-note">ATS compatibility, keyword coverage, and formatting checks are not included in the current analyzer response.</div>
            </>
          ) : (
            <div className="cf-empty-state"><span className="cf-icon-box"><Sparkles size={20} /></span><h2>{loading ? 'Reviewing your resume' : 'Your review will appear here'}</h2><p>{loading ? 'We are extracting resume text and checking its sections and skills.' : 'Add a resume to see its score, recognized skills, sections, and actionable suggestions.'}</p>{loading && <div className="cf-loading-bar"><span /></div>}</div>
          )}
        </section>
      </div>
      {result && <div className="cf-after-result"><span>Want to check fit for a role?</span><Link className="cf-secondary-button" to="/job-matcher">Compare with a job <ArrowRight size={15} /></Link></div>}
    </FeatureShell>
  );
};

export default ResumeAnalyzer;
