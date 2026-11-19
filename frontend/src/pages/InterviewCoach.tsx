import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

// Types
interface Question {
  id: string;
  text: string;
}

interface Answer {
  question_id: string;
  answer: string;
  question_text: string;
}

interface EvaluationResult {
  question_id: string;
  score: number;
  feedback: string[];
}

const InterviewCoach: React.FC = () => {
  // Setup state
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [type, setInterviewType] = useState('Technical');
  const [numQuestions, setNumQuestions] = useState(3);
  const [setupDone, setSetupDone] = useState(false);

  // Interview state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState<EvaluationResult[] | null>(null);
  const [error, setError] = useState<string>('');

  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          difficulty,
          interview_type: type,
          num_questions: numQuestions,
        }),
      });
      if (!resp.ok) throw new Error('Failed to start interview');
      const data = await resp.json();
      setQuestions(data.questions);
      setSetupDone(true);
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAns = e.target.value;
    setAnswers(prev => {
      const copy = [...prev];
      const q = questions[currentIdx];
      const existingIdx = copy.findIndex(a => a.question_id === q.id);
      const answerObj: Answer = {
        question_id: q.id,
        answer: newAns,
        question_text: q.text,
      };
      if (existingIdx >= 0) copy[existingIdx] = answerObj;
      else copy.push(answerObj);
      return copy;
    });
  };

  const currentAnswer = answers.find(a => a.question_id === questions[currentIdx]?.id)?.answer || '';

  const goPrev = () => setCurrentIdx(i => Math.max(i - 1, 0));
  const goNext = () => setCurrentIdx(i => Math.min(i + 1, questions.length - 1));

  const finishInterview = async () => {
    setEvaluating(true);
    setError('');
    try {
      const resp = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!resp.ok) throw new Error('Evaluation failed');
      const data = await resp.json();
      setResults(data.results);
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setEvaluating(false);
    }
  };

  // ---- UI ----
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 flex items-center"><ArrowRight className="mr-2"/>Interview Coach</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Setup form */}
      {!setupDone && (
        <div className="space-y-4 max-w-md">
          <label className="block"><span className="font-medium">Job Role</span>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className="border rounded w-full p-1"/>
          </label>
          <label className="block"><span className="font-medium">Difficulty</span>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border rounded w-full p-1">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label className="block"><span className="font-medium">Interview Type</span>
            <select value={type} onChange={e => setInterviewType(e.target.value)} className="border rounded w-full p-1">
              <option>Technical</option>
              <option>HR</option>
              <option>Behavioral</option>
            </select>
          </label>
          <label className="block"><span className="font-medium">Number of Questions</span>
            <input type="number" min={1} max={10} value={numQuestions} onChange={e => setNumQuestions(parseInt(e.target.value) || 1)} className="border rounded w-full p-1"/>
          </label>
          <button onClick={startInterview} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center">
            {loading ? <Loader2 className="animate-spin mr-2"/> : null}Start Interview
          </button>
        </div>
      )}

      {/* Interview UI */}
      {setupDone && !results && (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <button onClick={goPrev} disabled={currentIdx===0} className="px-2"><ArrowLeft/></button>
            <span>Question {currentIdx+1} of {questions.length}</span>
            <button onClick={goNext} disabled={currentIdx===questions.length-1} className="px-2"><ArrowRight/></button>
          </div>
          <div className="border rounded p-4 mb-2 bg-white dark:bg-gray-800">
            <p className="font-medium mb-2">{questions[currentIdx]?.text}</p>
            <textarea value={currentAnswer} onChange={handleAnswerChange} rows={6} className="w-full border rounded p-2" placeholder="Your answer..."/>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setSetupDone(false)} className="px-4 py-2 bg-gray-300 rounded">Reset</button>
            <button onClick={finishInterview} disabled={evaluating} className="px-4 py-2 bg-green-600 text-white rounded flex items-center">
              {evaluating ? <Loader2 className="animate-spin mr-2"/> : null}Finish & Evaluate
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Performance Report</h2>
          {results.map(r => (
            <div key={r.question_id} className="border rounded p-3 mb-2 bg-white dark:bg-gray-800">
              <p className="font-medium">Question {r.question_id}</p>
              <p>Score: {r.score * 100}% {r.score >= 0.6 ? <CheckCircle className="inline text-green-500"/> : <XCircle className="inline text-red-500"/>}</p>
              <ul className="list-disc list-inside ml-4">
                {r.feedback.map((msg, i) => (<li key={i}>{msg}</li>))}
              </ul>
            </div>
          ))}
          <button onClick={() => { setSetupDone(false); setResults(null); setAnswers([]); setCurrentIdx(0); }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Start New Interview</button>
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;
