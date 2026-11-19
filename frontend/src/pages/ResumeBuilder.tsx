import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';

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
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 flex items-center"><ShieldCheck className="mr-2" />Resume Builder</h1>

      {/* Template selector */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Template:</label>
        <select value={template} onChange={e => setTemplate(e.target.value as any)} className="rounded border p-1">
          <option value="classic">Classic Professional</option>
          <option value="modern">Modern Minimal</option>
          <option value="technical">Technical Developer</option>
        </select>
      </div>

      {/* Personal Information */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={data.personal.name} onChange={handlePersonalChange} required className="border rounded p-2" />
          <input type="email" name="email" placeholder="Email" value={data.personal.email} onChange={handlePersonalChange} required className="border rounded p-2" />
          <input name="phone" placeholder="Phone" value={data.personal.phone} onChange={handlePersonalChange} required className="border rounded p-2" />
          <input name="address" placeholder="Address" value={data.personal.address} onChange={handlePersonalChange} className="border rounded p-2" />
          <textarea name="summary" placeholder="Professional Summary" value={data.personal.summary} onChange={handlePersonalChange} rows={3} className="border rounded p-2 md:col-span-2"></textarea>
        </form>
      </section>

      {/* Education */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <form onSubmit={submitEdu} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input name="institution" placeholder="Institution" value={eduForm.institution || ''} onChange={handleEduChange} className="border rounded p-1" />
          <input name="degree" placeholder="Degree" value={eduForm.degree || ''} onChange={handleEduChange} className="border rounded p-1" />
          <input name="startYear" placeholder="Start Year" value={eduForm.startYear || ''} onChange={handleEduChange} className="border rounded p-1" />
          <input name="endYear" placeholder="End Year" value={eduForm.endYear || ''} onChange={handleEduChange} className="border rounded p-1" />
          <textarea name="description" placeholder="Description" value={eduForm.description || ''} onChange={handleEduChange} className="border rounded p-1 md:col-span-3" rows={2} />
          <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1 md:col-span-3 self-start">Add Education</button>
        </form>
        <ul>
          {data.education.map((e, idx) => (
            <li key={e.id} className="flex items-center justify-between border rounded p-2 mb-1">
              <div>
                <strong>{e.degree}</strong> – {e.institution} ({e.startYear}-{e.endYear})
                <p className="text-sm">{e.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setData(prev => ({ ...prev, education: moveItem(prev.education, e.id, 'up') }))} disabled={idx===0} className="px-2">↑</button>
                <button onClick={() => setData(prev => ({ ...prev, education: moveItem(prev.education, e.id, 'down') }))} disabled={idx===data.education.length-1} className="px-2">↓</button>
                <button onClick={() => setData(prev => ({ ...prev, education: deleteItem(prev.education, e.id) }))} className="text-red-600">✕</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Work Experience</h2>
        <form onSubmit={submitExp} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input name="company" placeholder="Company" value={expForm.company || ''} onChange={handleExpChange} className="border rounded p-1" />
          <input name="role" placeholder="Role" value={expForm.role || ''} onChange={handleExpChange} className="border rounded p-1" />
          <input name="startMonth" placeholder="Start (MM/YYYY)" value={expForm.startMonth || ''} onChange={handleExpChange} className="border rounded p-1" />
          <input name="endMonth" placeholder="End (MM/YYYY) or Present" value={expForm.endMonth || ''} onChange={handleExpChange} className="border rounded p-1" />
          <textarea name="description" placeholder="Description" value={expForm.description || ''} onChange={handleExpChange} className="border rounded p-1 md:col-span-3" rows={2} />
          <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1 md:col-span-3 self-start">Add Experience</button>
        </form>
        <ul>
          {data.experience.map((e, idx) => (
            <li key={e.id} className="flex items-center justify-between border rounded p-2 mb-1">
              <div>
                <strong>{e.role}</strong> @ {e.company} ({e.startMonth} - {e.endMonth})
                <p className="text-sm">{e.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setData(prev => ({ ...prev, experience: moveItem(prev.experience, e.id, 'up') }))} disabled={idx===0} className="px-2">↑</button>
                <button onClick={() => setData(prev => ({ ...prev, experience: moveItem(prev.experience, e.id, 'down') }))} disabled={idx===data.experience.length-1} className="px-2">↓</button>
                <button onClick={() => setData(prev => ({ ...prev, experience: deleteItem(prev.experience, e.id) }))} className="text-red-600">✕</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Projects */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
        <form onSubmit={submitProj} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input name="name" placeholder="Project Name" value={projForm.name || ''} onChange={handleProjChange} className="border rounded p-1" />
          <input name="link" placeholder="Link (optional)" value={projForm.link || ''} onChange={handleProjChange} className="border rounded p-1" />
          <textarea name="description" placeholder="Description" value={projForm.description || ''} onChange={handleProjChange} className="border rounded p-1 md:col-span-3" rows={2} />
          <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1 md:col-span-3 self-start">Add Project</button>
        </form>
        <ul>
          {data.projects.map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between border rounded p-2 mb-1">
              <div>
                <strong>{p.name}</strong> {p.link && (<a href={p.link} className="text-blue-600 dark:text-blue-400" target="_blank" rel="noreferrer">(link)</a>)}
                <p className="text-sm">{p.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setData(prev => ({ ...prev, projects: moveItem(prev.projects, p.id, 'up') }))} disabled={idx===0} className="px-2">↑</button>
                <button onClick={() => setData(prev => ({ ...prev, projects: moveItem(prev.projects, p.id, 'down') }))} disabled={idx===data.projects.length-1} className="px-2">↓</button>
                <button onClick={() => setData(prev => ({ ...prev, projects: deleteItem(prev.projects, p.id) }))} className="text-red-600">✕</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Certifications */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Certifications</h2>
        <form onSubmit={submitCert} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input name="name" placeholder="Certification Name" value={certForm.name || ''} onChange={handleCertChange} className="border rounded p-1" />
          <input name="issuer" placeholder="Issuer" value={certForm.issuer || ''} onChange={handleCertChange} className="border rounded p-1" />
          <input name="date" placeholder="Date (MM/YYYY)" value={certForm.date || ''} onChange={handleCertChange} className="border rounded p-1" />
          <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1 md:col-span-3 self-start">Add Certification</button>
        </form>
        <ul>
          {data.certifications.map((c, idx) => (
            <li key={c.id} className="flex items-center justify-between border rounded p-2 mb-1">
              <div>
                <strong>{c.name}</strong> – {c.issuer} ({c.date})
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setData(prev => ({ ...prev, certifications: moveItem(prev.certifications, c.id, 'up') }))} disabled={idx===0} className="px-2">↑</button>
                <button onClick={() => setData(prev => ({ ...prev, certifications: moveItem(prev.certifications, c.id, 'down') }))} disabled={idx===data.certifications.length-1} className="px-2">↓</button>
                <button onClick={() => setData(prev => ({ ...prev, certifications: deleteItem(prev.certifications, c.id) }))} className="text-red-600">✕</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-2">Technical Skills</h2>
        <form onSubmit={submitSkill} className="flex items-center space-x-2 mb-2">
          <input value={skillForm} onChange={e => setSkillForm(e.target.value)} placeholder="Skill name" className="border rounded p-1 flex-1" />
          <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1">Add Skill</button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {data.skills.map((s, idx) => (
            <li key={s.id} className="bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded flex items-center">
              {s.name}
              <button onClick={() => setData(prev => ({ ...prev, skills: deleteItem(prev.skills, s.id) }))} className="ml-1 text-red-600">✕</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Preview */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Live Preview</h2>
        <div id="resume-preview" className="border rounded p-4 max-w-3xl mx-auto bg-white dark:bg-gray-800">
          {template === 'classic' && <ClassicTemplate data={data} />}
          {template === 'modern' && <ModernTemplate data={data} />}
          {template === 'technical' && <TechnicalTemplate data={data} />}
        </div>
        <button onClick={handlePrint} className="mt-4 bg-green-600 text-white rounded px-4 py-2">Print / Save as PDF</button>
      </section>
    </div>
  );
};

export default ResumeBuilder;
