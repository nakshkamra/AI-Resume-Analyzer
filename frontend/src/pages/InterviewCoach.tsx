import React from 'react';
import { ArrowRight, Check, MessageSquare, Mic2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

const InterviewCoach: React.FC = () => (
  <FeatureShell eyebrow="Interview practice" title="Practice with purpose" description="Prepare for interviews with a structured practice flow. Coaching and answer evaluation are not yet connected." icon={MessageSquare}>
    <section className="cf-card cf-card-pad cf-interview-hero">
      <div className="cf-interview-copy"><span className="cf-coming"><Sparkles size={13} /> Coming soon</span><h2>A calmer way to prepare.</h2><p>The interview coach workspace is being developed. Practice sessions, generated questions, and answer feedback are not available yet.</p><Link to="/dashboard" className="cf-quiet-button">Back to your workspace</Link></div>
      <div className="cf-interview-preview" aria-label="Preview of the interview practice workspace">
        <div className="cf-interview-preview-top"><span><span className="cf-status-dot" /> PRACTICE SESSION</span><span className="cf-preview-chip">PREVIEW</span></div>
        <div className="cf-interview-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
        <div className="cf-interview-prompt"><small>SESSION DETAILS WILL APPEAR HERE</small><strong>Role-specific practice</strong><p>Question library and response tools are still in development.</p></div>
        <button className="cf-interview-mic" type="button" disabled aria-label="Voice practice unavailable"><Mic2 size={18} /></button>
      </div>
    </section>
    <div className="cf-two-col cf-coach-features">
      <div className="cf-card cf-card-pad"><SectionTitle icon={MessageSquare} title="Structured questions" /><p className="cf-muted">A guided question flow is planned for role and interview type.</p><div className="cf-placeholder-lines"><span /><span /><span /></div></div>
      <div className="cf-card cf-card-pad"><SectionTitle icon={ShieldCheck} title="Clear, useful feedback" /><p className="cf-muted">Answer evaluation and communication feedback will be available when the coaching service is connected.</p><div className="cf-coach-checks"><span><Check size={14} /> Specific to the role</span><span><Check size={14} /> Practical next steps</span></div></div>
    </div>
    <p className="cf-footer-note">This preview does not record audio or generate interview feedback.</p>
  </FeatureShell>
);

export default InterviewCoach;
