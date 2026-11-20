import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageSquare, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { FeatureShell, SectionTitle } from '../components/FeatureShell';

interface InterviewQuestion { id: string; text: string }
interface InterviewAnswer { question_id: string; answer: string; question_text: string }
interface EvaluationResult { question_id: string; score: number; feedback: string[] }

const InterviewCoach: React.FC = () => {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [interviewType, setInterviewType] = useState('Technical');
  const [questionCount, setQuestionCount] = useState(3);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<EvaluationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentAnswer = answers.find((answer) => answer.question_id === questions[currentIndex]?.id)?.answer || '';
  const updateAnswer = (value: string) => {
    const question = questions[currentIndex];
    if (!question) return;
    setAnswers((current) => {
      const existing = current.findIndex((answer) => answer.question_id === question.id);
      const nextAnswer = { question_id: question.id, answer: value, question_text: question.text };
      if (existing < 0) return [...current, nextAnswer];
      return current.map((answer, index) => index === existing ? nextAnswer : answer);
    });
  };

  const startInterview = async () => {
    setLoading(true); setError(''); setAnswers([]); setResults(null); setCurrentIndex(0);
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty, interview_type: interviewType, num_questions: questionCount }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Could not start an interview with those settings.');
      setQuestions(data.questions || []);
      setStarted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The interview service could not be reached.');
    } finally { setLoading(false); }
  };

  const evaluateInterview = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Could not evaluate your answers.');
      setResults(data.results || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The evaluation service could not be reached.');
    } finally { setLoading(false); }
  };

  const resetInterview = () => { setStarted(false); setResults(null); setQuestions([]); setAnswers([]); setCurrentIndex(0); setError(''); };

  return (
    <FeatureShell eyebrow="Interview practice" title="Prepare with focused practice" description="Choose a role and interview style, work through questions, then review feedback based on your answers." icon={MessageSquare}>
      {error && <div className="cf-alert" role="alert">{error}</div>}
      {!started && !results && <section className="cf-card cf-card-pad">
        <SectionTitle icon={Sparkles} title="Set up a practice session" />
        <div className="cf-two-col">
          <label className="cf-field-label">Target role<input className="cf-input" value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Software Engineer" /></label>
          <label className="cf-field-label">Difficulty<select className="cf-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>{['Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="cf-field-label">Interview type<select className="cf-select" value={interviewType} onChange={(event) => setInterviewType(event.target.value)}>{['Technical', 'HR', 'Behavioral'].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="cf-field-label">Number of questions<input className="cf-input" type="number" min={1} max={10} value={questionCount} onChange={(event) => setQuestionCount(Math.min(10, Math.max(1, Number(event.target.value) || 1)))} /></label>
        </div>
        <button className="cf-primary-button" style={{ marginTop: 18 }} type="button" disabled={loading || !role.trim()} onClick={startInterview}>{loading ? <Loader2 size={16} className="cf-spin" /> : <ArrowRight size={16} />} Start practice</button>
      </section>}

      {started && !results && questions.length > 0 && <section className="cf-card cf-card-pad">
        <div className="cf-toolbar"><SectionTitle icon={MessageSquare} title="Practice question" aside={<span className="cf-small-label">{difficulty} · {interviewType}</span>} /><span className="cf-count-badge">{currentIndex + 1} / {questions.length}</span></div>
        <div className="cf-skill-panel"><span className="cf-eyebrow">{role}</span><h2 style={{ margin: '10px 0 0', fontSize: 20 }}>{questions[currentIndex].text}</h2></div>
        <label className="cf-field-label" htmlFor="practice-answer" style={{ marginTop: 20 }}>Your answer</label>
        <textarea id="practice-answer" className="cf-textarea" value={currentAnswer} onChange={(event) => updateAnswer(event.target.value)} placeholder="Write your response. Include the context, your actions, and the result where relevant." />
        <div className="cf-toolbar" style={{ marginTop: 18 }}>
          <button className="cf-quiet-button" type="button" onClick={resetInterview}><RotateCcw size={14} /> Reset session</button>
          <div className="cf-toolbar">
            <button className="cf-secondary-button" type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}><ArrowLeft size={14} /> Previous</button>
            {currentIndex < questions.length - 1
              ? <button className="cf-primary-button" type="button" onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}>Next <ArrowRight size={14} /></button>
              : <button className="cf-primary-button" type="button" disabled={loading} onClick={evaluateInterview}>{loading ? <Loader2 size={15} className="cf-spin" /> : <CheckCircle2 size={15} />} Finish and review</button>}
          </div>
        </div>
      </section>}

      {results && <section className="cf-card cf-card-pad">
        <SectionTitle icon={CheckCircle2} title="Practice feedback" aside={<button className="cf-secondary-button" type="button" onClick={resetInterview}><RotateCcw size={14} /> New session</button>} />
        {results.length ? <div className="cf-two-col">{results.map((result) => <article className="cf-skill-panel" key={result.question_id}>
          <div className="cf-toolbar"><strong>Question {result.question_id}</strong><span className="cf-report-badge">{Math.round(result.score * 100)}% score</span></div>
          {result.feedback.length ? <ul className="cf-insight-list">{result.feedback.map((item, index) => <li key={`${result.question_id}-${index}`}>{item.startsWith('Good:') ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{item.replace(/^(Good|Missing):\s*/, '')}</li>)}</ul> : <p className="cf-muted">No detailed feedback was returned for this answer.</p>}
        </article>)}</div> : <p className="cf-muted">No answers were submitted for review. Start another practice session when ready.</p>}
        <p className="cf-compact-note" style={{ marginTop: 16 }}>Feedback is based on a small rule-based question and keyword set; use it as a practice aid, not a hiring evaluation.</p>
      </section>}
    </FeatureShell>
  );
};

export default InterviewCoach;
