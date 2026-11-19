import React, { useState } from 'react';

const JobMatcher: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please select a DOCX resume file.');
      return;
    }
    if (!jobDesc.trim()) {
      setError('Job description cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    formData.append('job_description', jobDesc);
    try {
      const resp = await fetch('/api/jobs/match', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        const err = await resp.json();
        setError(err.detail || 'Error matching job');
      } else {
        const data = await resp.json();
        setResult(data);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Job Matcher</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="border rounded p-2"
        />
        <textarea
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
          placeholder="Enter job description..."
          className="w-full border rounded p-2 h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {loading ? 'Matching...' : 'Match Job'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <pre className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default JobMatcher;
