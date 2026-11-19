import React, { useState, useEffect } from 'react';
import { roleSkills, RoleSkills } from '../data/roleSkills';
import { lessons, Lesson } from '../data/lessons';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Check } from 'lucide-react';

// Milestones per stage – simple static data – can be extended later
const stageMilestones: Record<string, string[]> = {
  Beginner: [
    'Understand basic syntax and tooling',
    'Write simple programs',
    'Version control with Git basics',
  ],
  Intermediate: [
    'Build modular code and libraries',
    'Write tests and use CI',
    'Advanced Git workflows',
  ],
  Advanced: [
    'Design scalable architectures',
    'Performance tuning & profiling',
    'Mentor junior developers',
  ],
};

const CareerRoadmap: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [targetRole, setTargetRole] = useState<RoleSkills | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('Beginner');
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

  // Load completed lessons (shared with VideoAcademy)
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Load persisted roadmap state (role, stage, milestones)
  useEffect(() => {
    const saved = localStorage.getItem('careerRoadmapState');
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setSelectedRole(obj.role || '');
        setSelectedStage(obj.stage || 'Beginner');
        setCompletedMilestones(obj.milestones || []);
      } catch {}
    }
  }, []);

  // Persist roadmap state whenever it changes
  useEffect(() => {
    const state = {
      role: selectedRole,
      stage: selectedStage,
      milestones: completedMilestones,
    };
    localStorage.setItem('careerRoadmapState', JSON.stringify(state));
  }, [selectedRole, selectedStage, completedMilestones]);

  // When role selected, compute targetRole
  useEffect(() => {
    if (selectedRole) {
      const rs = roleSkills.find(r => r.role === selectedRole) || null;
      setTargetRole(rs);
    } else {
      setTargetRole(null);
    }
  }, [selectedRole]);

  // Compute progress based on lessons covering role skills + milestones completed
  const totalSkills = targetRole ? targetRole.skills.length : 0;
  const coveredSkills = new Set<string>();
  completedLessons.forEach(lid => {
    const lesson = lessons.find(l => l.id === lid);
    if (lesson && targetRole?.skills.includes(lesson.skill)) {
      coveredSkills.add(lesson.skill);
    }
  });
  const skillProgress = totalSkills === 0 ? 0 : Math.round((coveredSkills.size / totalSkills) * 100);

  const totalMilestones = stageMilestones[selectedStage]?.length || 0;
  const milestoneProgress = totalMilestones === 0 ? 0 : Math.round((completedMilestones.length / totalMilestones) * 100);

  const overallProgress = Math.round((skillProgress + milestoneProgress) / 2);

  const toggleMilestone = (m: string) => {
    setCompletedMilestones(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset the entire roadmap? This will clear selections and progress.')) {
      setSelectedRole('');
      setTargetRole(null);
      setSelectedStage('Beginner');
      setCompletedMilestones([]);
      localStorage.removeItem('careerRoadmapState');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        <ArrowRight className="mr-2" />Career Roadmap
      </h1>

      {/* Role selection */}
      {!targetRole && (
        <div className="max-w-md">
          <label className="block mb-2">
            <span className="font-medium">Select your target role</span>
          </label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="border rounded w-full p-2"
          >
            <option value="">-- Choose role --</option>
            {roleSkills.map(r => (
              <option key={r.role} value={r.role}>
                {r.role}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Roadmap UI */}
      {targetRole && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Role: {targetRole.role}</h2>
          <p className="mb-2"><strong>Primary language:</strong> {targetRole.language}</p>
          <p className="mb-2"><strong>Core skills:</strong> {targetRole.skills.join(', ')}</p>

          {/* Stage selector */}
          <div className="my-4">
            <label className="mr-2 font-medium">Learning stage:</label>
            {['Beginner', 'Intermediate', 'Advanced'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStage(st)}
                className={`px-3 py-1 mr-2 rounded ${selectedStage === st ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Skill Gap Tracker */}
          <div className="my-4">
            <h3 className="text-xl font-semibold mb-2">Skill Gap Tracker</h3>
            <ul className="list-disc list-inside">
              {targetRole.skills.map(skill => {
                const covered = completedLessons.some(lid => {
                  const l = lessons.find(ls => ls.id === lid);
                  return l && l.skill === skill;
                });
                return (
                  <li key={skill} className="flex items-center">
                    {covered ? <CheckCircle className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
                    {skill}
                    <a href="/video-academy" className="ml-2 text-indigo-600 hover:underline">Learn</a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Milestones */}
          <div className="my-4">
            <h3 className="text-xl font-semibold mb-2">{selectedStage} Milestones</h3>
            <ul className="list-disc list-inside">
              {stageMilestones[selectedStage]?.map(m => (
                <li key={m} className="flex items-center">
                  <button
                    onClick={() => toggleMilestone(m)}
                    className="mr-2"
                    aria-label={completedMilestones.includes(m) ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {completedMilestones.includes(m) ? (
                      <Check className="text-green-500" />
                    ) : (
                      <RefreshCw className="text-gray-500" />
                    )}
                  </button>
                  <span className={completedMilestones.includes(m) ? 'line-through text-gray-500' : ''}>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress bars */}
          <div className="my-4">
            <p className="font-medium mb-1">Skill progress: {skillProgress}%</p>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4 mb-2">
              <div className="bg-indigo-600 h-4 rounded" style={{ width: `${skillProgress}%` }} />
            </div>
            <p className="font-medium mb-1">Milestone progress: {milestoneProgress}%</p>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4 mb-2">
              <div className="bg-indigo-600 h-4 rounded" style={{ width: `${milestoneProgress}%` }} />
            </div>
            <p className="font-medium mb-1">Overall progress: {overallProgress}%</p>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4">
              <div className="bg-indigo-600 h-4 rounded" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          <button onClick={handleReset} className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
            Reset Roadmap
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;
