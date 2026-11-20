import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, CheckCircle2, Circle, Map, RefreshCw, Target, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';
import { lessons } from '../data/lessons';
import { roleSkills, RoleSkills } from '../data/roleSkills';

const stageMilestones: Record<string, string[]> = {
  Beginner: ['Understand basic syntax and tooling', 'Write simple programs', 'Version control with Git basics'],
  Intermediate: ['Build modular code and libraries', 'Write tests and use CI', 'Advanced Git workflows'],
  Advanced: ['Design scalable architectures', 'Performance tuning and profiling', 'Mentor junior engineers'],
};

const CareerRoadmap: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStage, setSelectedStage] = useState('Beginner');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const targetRole: RoleSkills | undefined = useMemo(() => roleSkills.find((role) => role.role === selectedRole), [selectedRole]);

  useEffect(() => {
    try {
      const lessonsSaved = localStorage.getItem('completedLessons');
      if (lessonsSaved) setCompletedLessons(JSON.parse(lessonsSaved));
      const roadmapSaved = localStorage.getItem('careerRoadmapState');
      if (roadmapSaved) {
        const state = JSON.parse(roadmapSaved);
        setSelectedRole(state.role || '');
        setSelectedStage(state.stage || 'Beginner');
        setCompletedMilestones(state.milestones || []);
      }
    } catch {
      // Ignore invalid browser storage and let the user start a fresh roadmap.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careerRoadmapState', JSON.stringify({ role: selectedRole, stage: selectedStage, milestones: completedMilestones }));
  }, [selectedRole, selectedStage, completedMilestones]);

  const totalSkills = targetRole?.skills.length || 0;
  const coveredSkills = targetRole?.skills.filter((skill) => completedLessons.some((lessonId) => {
    const lesson = lessons.find((item) => item.id === lessonId);
    return lesson?.skill.toLowerCase() === skill.toLowerCase();
  })).length || 0;
  const skillProgress = totalSkills ? Math.round((coveredSkills / totalSkills) * 100) : 0;
  const milestones = stageMilestones[selectedStage] || [];
  const doneMilestones = milestones.filter((milestone) => completedMilestones.includes(milestone)).length;
  const milestoneProgress = milestones.length ? Math.round((doneMilestones / milestones.length) * 100) : 0;
  const overallProgress = Math.round((skillProgress + milestoneProgress) / 2);

  const toggleMilestone = (milestone: string) => setCompletedMilestones((current) => current.includes(milestone)
    ? current.filter((item) => item !== milestone)
    : [...current, milestone]);

  const resetRoadmap = () => {
    setSelectedRole('');
    setSelectedStage('Beginner');
    setCompletedMilestones([]);
    localStorage.removeItem('careerRoadmapState');
  };

  return (
    <FeatureShell eyebrow="Career planning" title="Build a path toward your next role" description="Choose a target role, follow milestones, and track learning progress from your academy lessons." icon={Map}>
      <section className="cf-card cf-card-pad">
        <SectionTitle icon={Target} title="Your target role" aside={targetRole && <button type="button" className="cf-quiet-button" onClick={resetRoadmap}><RefreshCw size={14} /> Reset plan</button>} />
        <label className="cf-field-label" htmlFor="target-role">Select a role to personalize your roadmap</label>
        <select id="target-role" className="cf-select" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
          <option value="">Choose a target role</option>
          {roleSkills.map((role) => <option key={role.role} value={role.role}>{role.role}</option>)}
        </select>
        {targetRole ? <>
          <div className="cf-roadmap-intro" style={{ marginTop: 18 }}>
            <div className="cf-roadmap-mark"><Target size={22} /></div>
            <div className="cf-roadmap-message"><span className="cf-small-label">TARGET ROLE · {targetRole.language}</span><h2>{targetRole.role}</h2><p>{targetRole.skills.join(' · ')}</p></div>
            <div className="cf-score-ring" style={{ '--score': `${overallProgress}%` } as React.CSSProperties}><div className="cf-score-ring-inner"><strong>{overallProgress}<small>%</small></strong><span>Progress</span></div></div>
          </div>
          <div className="cf-two-col cf-roadmap-preview-section">
            <section className="cf-skill-panel">
              <SectionTitle icon={CheckCircle2} title="Skill learning" aside={<span className="cf-count-badge">{coveredSkills}/{totalSkills}</span>} />
              <div className="cf-progress-track"><span style={{ width: `${skillProgress}%` }} /></div>
              <p className="cf-muted" style={{ marginTop: 12 }}>Complete matching lessons in the Academy to track skills here.</p>
              <div className="cf-pill-list" style={{ marginTop: 12 }}>{targetRole.skills.map((skill) => {
                const covered = lessons.some((lesson) => completedLessons.includes(lesson.id) && lesson.skill.toLowerCase() === skill.toLowerCase());
                return <span className={`cf-pill ${covered ? 'cf-pill-positive' : 'cf-pill-missing'}`} key={skill}>{covered ? <Check size={12} /> : <XCircle size={12} />}{skill}</span>;
              })}</div>
              <Link className="cf-secondary-button" style={{ marginTop: 16 }} to="/video-academy">Browse lessons <ArrowUpRight size={14} /></Link>
            </section>
            <section className="cf-skill-panel">
              <SectionTitle icon={Map} title="Learning milestones" aside={<span className="cf-count-badge">{doneMilestones}/{milestones.length}</span>} />
              <label className="cf-field-label" htmlFor="learning-stage">Experience stage</label>
              <select id="learning-stage" className="cf-select" value={selectedStage} onChange={(event) => setSelectedStage(event.target.value)}>
                {Object.keys(stageMilestones).map((stage) => <option key={stage}>{stage}</option>)}
              </select>
              <div className="cf-progress-track" style={{ marginTop: 14 }}><span style={{ width: `${milestoneProgress}%` }} /></div>
              <div className="cf-roadmap-track" style={{ marginTop: 18 }}>{milestones.map((milestone, index) => {
                const done = completedMilestones.includes(milestone);
                return <div className="cf-roadmap-step" key={milestone}>
                  <button type="button" className={`cf-roadmap-node ${done ? '' : 'muted'}`} onClick={() => toggleMilestone(milestone)} aria-label={done ? 'Mark milestone incomplete' : 'Mark milestone complete'}>{done ? <Check size={15} /> : <Circle size={13} />}</button>
                  <div><small>MILESTONE {String(index + 1).padStart(2, '0')}</small><strong className={done ? 'line-through' : ''}>{milestone}</strong></div>
                  <span className="cf-step-status">{done ? 'Complete' : 'To do'}</span>
                </div>;
              })}</div>
            </section>
          </div>
        </> : <p className="cf-muted" style={{ marginTop: 14 }}>Select a role to see its skills and learning milestones.</p>}
      </section>
    </FeatureShell>
  );
};

export default CareerRoadmap;
