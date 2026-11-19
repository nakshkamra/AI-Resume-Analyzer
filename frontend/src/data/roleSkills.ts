// src/data/roleSkills.ts
export interface RoleSkills {
  role: string;
  language: string; // primary language for the role
  skills: string[]; // list of core skills for the role
}

export const roleSkills: RoleSkills[] = [
  {
    role: 'Software Engineer',
    language: 'JavaScript',
    skills: ['JavaScript', 'Git', 'SQL', 'Node.js', 'React'],
  },
  {
    role: 'Data Scientist',
    language: 'Python',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL'],
  },
  {
    role: 'DevOps Engineer',
    language: 'General',
    skills: ['Linux', 'Docker', 'Kubernetes', 'Git', 'CI/CD'],
  },
];
