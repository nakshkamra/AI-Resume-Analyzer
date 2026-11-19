import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobMatcher from './pages/JobMatcher';
import VideoAcademy from './pages/VideoAcademy';
import InterviewCoach from './pages/InterviewCoach';
import ResumeBuilder from './pages/ResumeBuilder';
import CareerRoadmap from './pages/CareerRoadmap';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      <Route path="/job-matcher" element={<JobMatcher />} />
      <Route path="/video-academy" element={<VideoAcademy />} />
      <Route path="/interview-coach" element={<InterviewCoach />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/career-roadmap" element={<CareerRoadmap />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
