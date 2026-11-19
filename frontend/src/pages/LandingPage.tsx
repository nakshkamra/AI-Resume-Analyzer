import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <section className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4">
          CareerFit Pro
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          AI‑powered resume analysis, job matching and career growth tools – all in one premium platform.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
          >
            Learn More
          </a>
        </div>
      </section>
      <section id="features" className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Resume Analyzer</h2>
          <p className="text-gray-600 dark:text-gray-400">Instant AI feedback to make your resume stand out.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Job Matcher</h2>
          <p className="text-gray-600 dark:text-gray-400">Smart matching with thousands of openings.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Video Academy</h2>
          <p className="text-gray-600 dark:text-gray-400">Learn programming concepts via curated video lessons.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Interview Coach</h2>
          <p className="text-gray-600 dark:text-gray-400">Practice technical interviews with AI‑generated questions.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Resume Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Create a professional resume with AI assistance.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Customize your app experience, including theme and preferences.</p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage;
