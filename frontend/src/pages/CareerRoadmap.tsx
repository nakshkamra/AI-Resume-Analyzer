import React from 'react';
import { ArrowRight, Compass, Flag, Layers3, Map, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

const CareerRoadmap: React.FC = () => (
  <FeatureShell eyebrow="Career planning" title="Make your next move clearer" description="A roadmap should be grounded in your current skills and target role. Career path generation is not connected in this version." icon={Map}>
    <section className="cf-card cf-roadmap-intro">
      <div className="cf-roadmap-mark"><Compass size={25} /></div>
      <div className="cf-roadmap-message"><span className="cf-coming">Roadmap planner · In development</span><h2>A career plan built around your goals.</h2><p>Once career planning is implemented, this space will connect your current profile to realistic role milestones. No career path or required skills are being generated yet.</p></div>
      <Link className="cf-secondary-button" to="/job-matcher">Explore role fit <ArrowRight size={14} /></Link>
    </section>
    <section className="cf-card cf-card-pad cf-roadmap-preview-section">
      <div className="cf-toolbar"><SectionTitle icon={Layers3} title="Roadmap structure" /><span className="cf-small-label">Preview · No saved plan</span></div>
      <div className="cf-roadmap-track">
        <div className="cf-roadmap-step"><span className="cf-roadmap-node"><Target size={15} /></span><div><small>STEP 01</small><strong>Choose a target role</strong><p>Your target is needed before the roadmap can be tailored.</p></div><span className="cf-step-status">Awaiting goal</span></div>
        <div className="cf-roadmap-step"><span className="cf-roadmap-node muted"><Layers3 size={15} /></span><div><small>STEP 02</small><strong>Map your skill gaps</strong><p>Required skills must come from a role-specific analysis.</p></div><span className="cf-step-status">Not started</span></div>
        <div className="cf-roadmap-step"><span className="cf-roadmap-node muted"><Flag size={15} /></span><div><small>STEP 03</small><strong>Set learning milestones</strong><p>Milestones will follow the verified skills and progress data.</p></div><span className="cf-step-status">Not started</span></div>
      </div>
    </section>
    <p className="cf-footer-note">The steps above describe the planned flow; they are not a generated or saved career recommendation.</p>
  </FeatureShell>
);

export default CareerRoadmap;
