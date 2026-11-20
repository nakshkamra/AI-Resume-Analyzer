import React, { ReactNode } from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type FeatureShellProps = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  children: ReactNode;
};

export const FeatureShell: React.FC<FeatureShellProps> = ({ title, description, eyebrow, icon: Icon, children }) => (
  <main className="cf-page">
    <div className="cf-topbar">
      <Link to="/dashboard" className="cf-brand" aria-label="CareerFit dashboard">
        <span className="cf-brand-mark">C</span>
        <span>careerfit</span>
      </Link>
      <Link className="cf-back-link" to="/dashboard"><ArrowLeft size={16} /> Back to dashboard</Link>
    </div>
    <div className="cf-container">
      <header className="cf-page-heading">
        <span className="cf-eyebrow"><Icon size={14} /> {eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  </main>
);

export const ScoreRing: React.FC<{ score: number; label: string; caption?: string }> = ({ score, label, caption }) => {
  const bounded = Math.min(100, Math.max(0, Math.round(score)));
  return (
    <div className="cf-score-ring" style={{ '--score': `${bounded}%` } as React.CSSProperties} aria-label={`${label}: ${bounded}%`}>
      <div className="cf-score-ring-inner">
        <strong>{bounded}<small>%</small></strong>
        <span>{label}</span>
      </div>
      {caption && <p>{caption}</p>}
    </div>
  );
};

export const SectionTitle: React.FC<{ icon: LucideIcon; title: string; aside?: ReactNode }> = ({ icon: Icon, title, aside }) => (
  <div className="cf-section-title">
    <div><span className="cf-icon-box"><Icon size={17} /></span><h2>{title}</h2></div>
    {aside}
  </div>
);
