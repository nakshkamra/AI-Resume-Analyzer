import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ArrowDown, ArrowUp, Check, Download, FileEdit, GraduationCap, Plus, ShieldCheck, Trash2, User2 } from 'lucide-react';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

// ----- Types -----
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startMonth: string;
  endMonth: string;
  description: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  link?: string;
  description: string;
}

interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface SkillEntry {
  id: string;
  name: string;
}

// Utility to generate simple ids
const genId = () => Math.random().toString(36).substring(2, 9);

// ----- Template Components -----
const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" style={{ fontFamily: 'serif' }}>
    <h1 className="text-3xl font-bold border-b pb-2 mb-4">{data.personal.name}</h1>
    <p className="mb-2"><strong>Email:</strong> {data.personal.email} | <strong>Phone:</strong> {data.personal.phone}</p>
    <p className="mb-4"><strong>Address:</strong> {data.personal.address}</p>
    <p className="italic mb-4">{data.personal.summary}</p>
    <section className="mb-4">
      <h2 className="text-xl font-semibold">Education</h2>
      {data.education.map(e => (
        <div key={e.id} className="mt-2">
          <p className="font-medium">{e.degree}, {e.institution} ({e.startYear} - {e.endYear})</p>
          <p className="text-sm">{e.description}</p>
        </div>
      ))}
    </section>
    <section className="mb-4">
      <h2 className="text-xl font-semibold">Experience</h2>
      {data.experience.map(e => (
        <div key={e.id} className="mt-2">
          <p className="font-medium">{e.role} @ {e.company} ({e.startMonth} - {e.endMonth})</p>
          <p className="text-sm">{e.description}</p>
        </div>
      ))}
    </section>
    <section className="mb-4">
      <h2 className="text-xl font-semibold">Projects</h2>
      {data.projects.map(p => (
        <div key={p.id} className="mt-2">
          <p className="font-medium">{p.name} {p.link && (<a href={p.link} className="text-blue-600 dark:text-blue-400" target="_blank" rel="noreferrer">(link)</a>)}</p>
          <p className="text-sm">{p.description}</p>
        </div>
      ))}
    </section>
    <section className="mb-4">
      <h2 className="text-xl font-semibold">Certifications</h2>
      {data.certifications.map(c => (
        <div key={c.id} className="mt-2">
          <p className="font-medium">{c.name} – {c.issuer} ({c.date})</p>
        </div>
      ))}
    </section>
    <section>
      <h2 className="text-xl font-semibold">Skills</h2>
      <ul className="list-disc list-inside">
        {data.skills.map(s => (<li key={s.id}>{s.name}</li>))}
      </ul>
    </section>
  </div>
);

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200" style={{ fontFamily: 'sans-serif' }}>
    <header className="border-b pb-4 mb-4">
      <h1 className="text-4xl font-bold">{data.personal.name}</h1>
      <p>{data.personal.summary}</p>
    </header>
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p>{data.personal.email}<br />{data.personal.phone}<br />{data.personal.address}</p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map(s => (<span key={s.id} className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">{s.name}</span>))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        {data.education.map(e => (
          <div key={e.id} className="mb-2">
            <p className="font-medium">{e.degree} – {e.institution}</p>
            <p className="text-sm">{e.startYear} - {e.endYear}</p>
          </div>
        ))}
        <h2 className="text-2xl font-semibold mt-4 mb-2">Experience</h2>
        {data.experience.map(e => (
          <div key={e.id} className="mb-2">
            <p className="font-medium">{e.role} @ {e.company}</p>
            <p className="text-sm">{e.startMonth} - {e.endMonth}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="mt-4">
      <h2 className="text-2xl font-semibold mb-2">Projects</h2>
      {data.projects.map(p => (
        <div key={p.id} className="mb-2">
          <p className="font-medium">{p.name} {p.link && (<a href={p.link} className="text-blue-600 dark:text-blue-400" target="_blank" rel="noreferrer">(link)</a>)}</p>
          <p className="text-sm">{p.description}</p>
        </div>
      ))}
    </section>
    <section className="mt-4">
      <h2 className="text-2xl font-semibold mb-2">Certifications</h2>
      {data.certifications.map(c => (
        <div key={c.id} className="mb-2">
          <p className="font-medium">{c.name} – {c.issuer} ({c.date})</p>
        </div>
      ))}
    </section>
  </div>
);

const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono">
    <header className="mb-4">
      <h1 className="text-3xl font-bold">{data.personal.name}</h1>
      <p className="text-sm">{data.personal.summary}</p>
    </header>
    <section className="mb-2">
      <h2 className="text-xl font-semibold">Contact</h2>
      <p>{data.personal.email} | {data.personal.phone} | {data.personal.address}</p>
    </section>
    <section className="mb-2">
      <h2 className="text-xl font-semibold">Technical Skills</h2>
      <ul className="list-disc list-inside">
        {data.skills.map(s => (<li key={s.id}>{s.name}</li>))}
      </ul>
    </section>
    <section className="mb-2">
      <h2 className="text-xl font-semibold">Education</h2>
      {data.education.map(e => (
        <div key={e.id} className="mt-1">
          <p className="font-medium">{e.degree} – {e.institution} ({e.startYear}-{e.endYear})</p>
        </div>
      ))}
    </section>
    <section className="mb-2">
      <h2 className="text-xl font-semibold">Experience</h2>
      {data.experience.map(e => (
        <div key={e.id} className="mt-1">
          <p className="font-medium">{e.role} @ {e.company} ({e.startMonth}-{e.endMonth})</p>
        </div>
      ))}
    </section>
    <section className="mb-2">
      <h2 className="text-xl font-semibold">Projects</h2>
      {data.projects.map(p => (
        <div key={p.id} className="mt-1">
          <p className="font-medium">{p.name}</p>
          {p.link && (<a href={p.link} className="text-blue-600 dark:text-blue-400" target="_blank" rel="noreferrer">Link</a>)}
          <p className="text-sm">{p.description}</p>
        </div>
      ))}
    </section>
    <section>
      <h2 className="text-xl font-semibold">Certifications</h2>
      {data.certifications.map(c => (
        <div key={c.id} className="mt-1">
          <p className="font-medium">{c.name} – {c.issuer} ({c.date})</p>
        </div>
      ))}
    </section>
  </div>
);

// ----- Combined Data Type -----
interface ResumeData {
  personal: PersonalInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  skills: SkillEntry[];
}

// ----- Main Component -----
const ResumeBuilder: React.FC = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeBuilder');
    if (saved) {
      try { return JSON.parse(saved) as ResumeData; } catch { /* ignore */ }
    }
    // default empty state
    return {
      personal: { name: '', email: '', phone: '', address: '', summary: '' },
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      skills: [],
    };
  });

  const [template, setTemplate] = useState<'classic' | 'modern' | 'technical'>('classic');

  // persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('resumeBuilder', JSON.stringify(data));
  }, [data]);

  // ----- Handlers for personal info -----
  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  // ----- Generic list handlers -----
  const addItem = <T extends { id: string }>(list: T[], item: Omit<T, 'id'>): T[] => {
    return [...list, { ...item, id: genId() } as T];
  };

  const updateItem = <T extends { id: string }>(list: T[], id: string, updated: Partial<T>): T[] => {
    return list.map(i => (i.id === id ? { ...i, ...updated } : i));
  };

  const deleteItem = <T extends { id: string }>(list: T[], id: string): T[] => {
    return list.filter(i => i.id !== id);
  };

  const moveItem = <T extends { id: string }>(list: T[], id: string, direction: 'up' | 'down'): T[] => {
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return list;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return list;
    const newList = [...list];
    const [item] = newList.splice(index, 1);
    newList.splice(newIndex, 0, item);
    return newList;
  };

  // ----- Section specific forms -----
  const [eduForm, setEduForm] = useState<Partial<EducationEntry>>({});
  const handleEduChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEduForm(prev => ({ ...prev, [name]: value }));
  };
  const submitEdu = (e: FormEvent) => {
    e.preventDefault();
    if (!eduForm.institution || !eduForm.degree) return;
    setData(prev => ({ ...prev, education: addItem(prev.education, eduForm as EducationEntry) }));
    setEduForm({});
  };

  const [expForm, setExpForm] = useState<Partial<ExperienceEntry>>({});
  const handleExpChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpForm(prev => ({ ...prev, [name]: value }));
  };
  const submitExp = (e: FormEvent) => {
    e.preventDefault();
    if (!expForm.company || !expForm.role) return;
    setData(prev => ({ ...prev, experience: addItem(prev.experience, expForm as ExperienceEntry) }));
    setExpForm({});
  };

  const [projForm, setProjForm] = useState<Partial<ProjectEntry>>({});
  const handleProjChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjForm(prev => ({ ...prev, [name]: value }));
  };
  const submitProj = (e: FormEvent) => {
    e.preventDefault();
    if (!projForm.name) return;
    setData(prev => ({ ...prev, projects: addItem(prev.projects, projForm as ProjectEntry) }));
    setProjForm({});
  };

  const [certForm, setCertForm] = useState<Partial<CertificationEntry>>({});
  const handleCertChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCertForm(prev => ({ ...prev, [name]: value }));
  };
  const submitCert = (e: FormEvent) => {
    e.preventDefault();
    if (!certForm.name) return;
    setData(prev => ({ ...prev, certifications: addItem(prev.certifications, certForm as CertificationEntry) }));
    setCertForm({});
  };

  const [skillForm, setSkillForm] = useState<string>('');
  const submitSkill = (e: FormEvent) => {
    e.preventDefault();
    if (!skillForm.trim()) return;
    setData(prev => ({ ...prev, skills: addItem(prev.skills, { name: skillForm.trim() } as SkillEntry) }));
    setSkillForm('');
  };

  // ----- PDF / Print -----
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const doc = printWindow.document;
    doc.write('<html><head><title>Resume</title>');
    // include minimal CSS for print (Tailwind utilities are already inlined via CDN in production, but for simplicity we rely on browser defaults)
    doc.write('<style>@media print { body { -webkit-print-color-adjust: exact; } }</style>');
    doc.write('</head><body>');
    const container = document.getElementById('resume-preview');
    if (container) {
      doc.write(container.innerHTML);
    } else {
      doc.write('No preview available');
    }
    doc.write('</body></html>');
    doc.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // ----- Render -----
  const entryActions = (list: 'education' | 'experience' | 'projects' | 'certifications', id: string, index: number, count: number) => (
    <div className="cf-entry-actions">
      <button type="button" className="cf-icon-button" aria-label="Move item up" disabled={index === 0} onClick={() => setData(prev => ({ ...prev, [list]: moveItem(prev[list] as any, id, 'up') as any }))}><ArrowUp size={15} /></button>
      <button type="button" className="cf-icon-button" aria-label="Move item down" disabled={index === count - 1} onClick={() => setData(prev => ({ ...prev, [list]: moveItem(prev[list] as any, id, 'down') as any }))}><ArrowDown size={15} /></button>
      <button type="button" className="cf-icon-button danger" aria-label="Remove item" onClick={() => setData(prev => ({ ...prev, [list]: deleteItem(prev[list] as any, id) as any }))}><Trash2 size={15} /></button>
    </div>
  );

  return (
    <FeatureShell eyebrow="Document studio" title="Build your resume" description="Shape your experience into a clear, professional document. Your edits are saved in this browser as you work." icon={FileEdit}>
      <div className="cf-builder-toolbar cf-card cf-card-pad">
        <div><span className="cf-save-indicator"><Check size={13} /> Saved in this browser</span><p>Choose a style, add your details, and review the live document.</p></div>
        <label className="cf-template-select"><span>Template</span><select value={template} onChange={e => setTemplate(e.target.value as 'classic' | 'modern' | 'technical')} className="cf-select"><option value="classic">Classic professional</option><option value="modern">Modern minimal</option><option value="technical">Technical developer</option></select></label>
      </div>
      <div className="cf-resume-editor-grid">
        <div className="cf-editor-column">
          <section className="cf-card cf-builder-section"><SectionTitle icon={User2} title="Personal information" aside={<span className="cf-small-label">Required details</span>} /><div className="cf-field-grid">
            <input aria-label="Full name" name="name" placeholder="Full name" value={data.personal.name} onChange={handlePersonalChange} required className="cf-input" />
            <input aria-label="Email" type="email" name="email" placeholder="Email address" value={data.personal.email} onChange={handlePersonalChange} required className="cf-input" />
            <input aria-label="Phone" name="phone" placeholder="Phone number" value={data.personal.phone} onChange={handlePersonalChange} required className="cf-input" />
            <input aria-label="Location" name="address" placeholder="City, country" value={data.personal.address} onChange={handlePersonalChange} className="cf-input" />
            <textarea aria-label="Professional summary" name="summary" placeholder="Professional summary" value={data.personal.summary} onChange={handlePersonalChange} rows={3} className="cf-textarea cf-span-two" />
          </div></section>

          <section className="cf-card cf-builder-section"><SectionTitle icon={ShieldCheck} title="Experience" aside={<span className="cf-small-label">{data.experience.length} entries</span>} /><form onSubmit={submitExp} className="cf-entry-form"><div className="cf-field-grid"><input aria-label="Company" name="company" placeholder="Company" value={expForm.company || ''} onChange={handleExpChange} className="cf-input" /><input aria-label="Role" name="role" placeholder="Role or title" value={expForm.role || ''} onChange={handleExpChange} className="cf-input" /><input aria-label="Experience start" name="startMonth" placeholder="Start (MM/YYYY)" value={expForm.startMonth || ''} onChange={handleExpChange} className="cf-input" /><input aria-label="Experience end" name="endMonth" placeholder="End or present" value={expForm.endMonth || ''} onChange={handleExpChange} className="cf-input" /><textarea aria-label="Experience description" name="description" placeholder="Impact, responsibilities, and results" value={expForm.description || ''} onChange={handleExpChange} rows={2} className="cf-textarea cf-span-two" /></div><button type="submit" className="cf-quiet-button"><Plus size={15} /> Add experience</button></form>{data.experience.map((item, index) => <div className="cf-entry-row" key={item.id}><div><strong>{item.role}</strong><p>{item.company} · {item.startMonth} – {item.endMonth}</p><p>{item.description}</p></div>{entryActions('experience', item.id, index, data.experience.length)}</div>)}</section>

          <section className="cf-card cf-builder-section"><SectionTitle icon={GraduationCap} title="Education" aside={<span className="cf-small-label">{data.education.length} entries</span>} /><form onSubmit={submitEdu} className="cf-entry-form"><div className="cf-field-grid"><input aria-label="Institution" name="institution" placeholder="Institution" value={eduForm.institution || ''} onChange={handleEduChange} className="cf-input" /><input aria-label="Degree" name="degree" placeholder="Degree or qualification" value={eduForm.degree || ''} onChange={handleEduChange} className="cf-input" /><input aria-label="Education start year" name="startYear" placeholder="Start year" value={eduForm.startYear || ''} onChange={handleEduChange} className="cf-input" /><input aria-label="Education end year" name="endYear" placeholder="End year" value={eduForm.endYear || ''} onChange={handleEduChange} className="cf-input" /><textarea aria-label="Education detail" name="description" placeholder="Relevant coursework or honors" value={eduForm.description || ''} onChange={handleEduChange} rows={2} className="cf-textarea cf-span-two" /></div><button type="submit" className="cf-quiet-button"><Plus size={15} /> Add education</button></form>{data.education.map((item, index) => <div className="cf-entry-row" key={item.id}><div><strong>{item.degree}</strong><p>{item.institution} · {item.startYear} – {item.endYear}</p><p>{item.description}</p></div>{entryActions('education', item.id, index, data.education.length)}</div>)}</section>

          <section className="cf-card cf-builder-section"><SectionTitle icon={FileEdit} title="Projects" aside={<span className="cf-small-label">{data.projects.length} entries</span>} /><form onSubmit={submitProj} className="cf-entry-form"><div className="cf-field-grid"><input aria-label="Project name" name="name" placeholder="Project name" value={projForm.name || ''} onChange={handleProjChange} className="cf-input" /><input aria-label="Project link" name="link" placeholder="Project link (optional)" value={projForm.link || ''} onChange={handleProjChange} className="cf-input" /><textarea aria-label="Project description" name="description" placeholder="What did you build or accomplish?" value={projForm.description || ''} onChange={handleProjChange} rows={2} className="cf-textarea cf-span-two" /></div><button type="submit" className="cf-quiet-button"><Plus size={15} /> Add project</button></form>{data.projects.map((item, index) => <div className="cf-entry-row" key={item.id}><div><strong>{item.name}</strong>{item.link && <a className="cf-project-link" href={item.link} target="_blank" rel="noreferrer">Open link</a>}<p>{item.description}</p></div>{entryActions('projects', item.id, index, data.projects.length)}</div>)}</section>

          <section className="cf-card cf-builder-section"><SectionTitle icon={ShieldCheck} title="Certifications" aside={<span className="cf-small-label">{data.certifications.length} entries</span>} /><form onSubmit={submitCert} className="cf-entry-form"><div className="cf-field-grid"><input aria-label="Certification name" name="name" placeholder="Certification name" value={certForm.name || ''} onChange={handleCertChange} className="cf-input" /><input aria-label="Certification issuer" name="issuer" placeholder="Issuing organization" value={certForm.issuer || ''} onChange={handleCertChange} className="cf-input" /><input aria-label="Certification date" name="date" placeholder="Date (MM/YYYY)" value={certForm.date || ''} onChange={handleCertChange} className="cf-input" /></div><button type="submit" className="cf-quiet-button"><Plus size={15} /> Add certification</button></form>{data.certifications.map((item, index) => <div className="cf-entry-row" key={item.id}><div><strong>{item.name}</strong><p>{item.issuer} · {item.date}</p></div>{entryActions('certifications', item.id, index, data.certifications.length)}</div>)}</section>

          <section className="cf-card cf-builder-section"><SectionTitle icon={ShieldCheck} title="Skills" aside={<span className="cf-small-label">{data.skills.length} skills</span>} /><form onSubmit={submitSkill} className="cf-skill-form"><input aria-label="Add a skill" value={skillForm} onChange={e => setSkillForm(e.target.value)} placeholder="Add a skill" className="cf-input" /><button type="submit" className="cf-primary-button"><Plus size={15} /> Add</button></form><div className="cf-pill-list cf-skill-list">{data.skills.map((item) => <span className="cf-pill" key={item.id}>{item.name}<button type="button" aria-label={`Remove ${item.name}`} onClick={() => setData(prev => ({ ...prev, skills: deleteItem(prev.skills, item.id) }))}><Trash2 size={12} /></button></span>)}</div></section>
        </div>

        <aside className="cf-resume-preview"><section className="cf-card cf-card-pad"><div className="cf-preview-toolbar"><div><SectionTitle icon={FileEdit} title="Live preview" /><p>Updates as you edit</p></div><button type="button" className="cf-primary-button" onClick={handlePrint}><Download size={15} /> Export PDF</button></div><div id="resume-preview" className="cf-resume-paper">{template === 'classic' && <ClassicTemplate data={data} />}{template === 'modern' && <ModernTemplate data={data} />}{template === 'technical' && <TechnicalTemplate data={data} />}</div><p className="cf-footer-note">Use your browser’s print dialog and choose “Save as PDF.”</p></section></aside>
      </div>
    </FeatureShell>
  );
};

export default ResumeBuilder;
