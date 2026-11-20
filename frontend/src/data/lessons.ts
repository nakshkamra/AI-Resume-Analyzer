// src/data/lessons.ts
export interface Lesson {
  id: string;
  title: string;
  language: string; // e.g., "JavaScript", "Python"
  skill: string; // e.g., "Promises", "Async/Await"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string; // real video URL (YouTube)
}

export const lessons: Lesson[] = [
  {
    id: 'js-promises-1',
    title: 'JavaScript Promises Explained',
    language: 'JavaScript',
    skill: 'Promises',
    difficulty: 'Beginner',
    url: 'https://www.youtube.com/watch?v=DHvZLI7Db8E',
  },
  {
    id: 'js-async-1',
    title: 'Async/Await in JavaScript',
    language: 'JavaScript',
    skill: 'Async/Await',
    difficulty: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
  },
  {
    id: 'py-dataframe-1',
    title: 'Pandas DataFrames Tutorial',
    language: 'Python',
    skill: 'Pandas',
    difficulty: 'Beginner',
    url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
  },
  {
    id: 'py-ml-1',
    title: 'Machine Learning Basics with Scikit‑Learn',
    language: 'Python',
    skill: 'Scikit-learn',
    difficulty: 'Intermediate',
    url: 'https://www.youtube.com/watch?v=0Lt9w-BxKFQ',
  },
  {
    id: 'git-basics-1',
    title: 'Git Basics: Commit, Branch, Merge',
    language: 'General',
    skill: 'Git',
    difficulty: 'Beginner',
    url: 'https://www.youtube.com/watch?v=8JJ101D3knE',
  },
  {
    id: 'sql-joins-1',
    title: 'SQL Joins Explained',
    language: 'SQL',
    skill: 'SQL',
    difficulty: 'Beginner',
    url: 'https://www.youtube.com/watch?v=9Pzj7Aj25lw',
  },
];
