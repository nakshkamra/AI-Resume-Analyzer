import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Play, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

const VideoAcademy: React.FC = () => (
  <FeatureShell eyebrow="Learning studio" title="Build your next skill" description="A focused space for career learning. The course catalog and video player are not connected yet." icon={Video}>
    <section className="cf-card cf-card-pad cf-academy-hero">
      <div className="cf-academy-copy"><span className="cf-coming"><Clock3 size={13} /> In development</span><h2>Your learning plan, in one place.</h2><p>CareerFit Academy is being prepared. When learning content is available, you’ll be able to track progress and pick up where you left off.</p><span className="cf-small-label">No courses or videos are available in this version.</span></div>
      <div className="cf-academy-art" aria-hidden="true"><div className="cf-academy-screen"><div className="cf-academy-screen-head"><BookOpen size={15} /> LEARNING STUDIO</div><div className="cf-academy-play"><Play size={18} fill="currentColor" /></div><span>Course previews will appear here</span><div className="cf-preview-line purple" style={{ width: '72%' }} /><div className="cf-preview-line" style={{ width: '46%' }} /></div><div className="cf-academy-stamp"><CheckCircle2 size={15} /> Progress tracking</div></div>
    </section>
    <div className="cf-two-col cf-academy-lower">
      <section className="cf-card cf-card-pad"><SectionTitle icon={Play} title="Continue learning" /><div className="cf-empty-inline"><span className="cf-empty-dot"><Play size={14} /></span><div><strong>Nothing in progress</strong><p>Your learning progress will be shown here when courses launch.</p></div></div><div className="cf-academy-progress"><div><span>Learning progress</span><span>Available with courses</span></div><div className="cf-progress-track"><span style={{ width: '0%' }} /></div></div></section>
      <section className="cf-card cf-card-pad"><SectionTitle icon={BookOpen} title="Explore learning topics" /><div className="cf-topic-list"><span>Interview preparation <small>Planned</small></span><span>Resume writing <small>Planned</small></span><span>Career skills <small>Planned</small></span></div></section>
    </div>
    <div className="cf-after-result"><span>Keep building your career profile while the academy is prepared.</span><Link className="cf-secondary-button" to="/resume-analyzer">Review your resume <ArrowRight size={14} /></Link></div>
  </FeatureShell>
);

export default VideoAcademy;
