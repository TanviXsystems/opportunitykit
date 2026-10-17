import { OpportunityInput, StudentProfile } from './types';

/**
 * Fictional demo data. Every person, company and institution here is
 * invented for demonstration purposes only.
 */

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Aarav Sharma (fictional demo student)',
  degree: 'B.Tech',
  degreeField: 'Computer Science',
  year: '3rd year',
  expectedGraduation: '2027',
  cgpa: 7.2,
  skills: ['Python', 'SQL', 'React', 'Git', 'Node.js'],
  location: 'Jaipur, Rajasthan',
  availableDurationMonths: null,
  willingToRelocate: null,
  citizenship: 'India',
  documents: { resume: true, transcript: false, passport: false },
};

export const SAMPLE_OPPORTUNITY_1: OpportunityInput = {
  title: 'Software Engineering Intern — Nova Robotics Labs (Bengaluru) [SAMPLE]',
  source: 'Sample opportunity — fictional company, included with the demo',
  description: [
    'Nova Robotics Labs is hiring a Summer Software Engineering Intern in Bengaluru.',
    'Requirements:',
    '- Pursuing a B.Tech in Computer Science or a related field.',
    '- Minimum CGPA of 7.5/10 throughout academics.',
    '- Proficiency in Python and React is required.',
    '- Familiarity with ROS (Robot Operating System) is preferred.',
    '- Must be available for at least 6 months.',
    '- Willingness to relocate to Bengaluru is required.',
    '- Indian citizenship or valid work authorization in India.',
    '- Resume and a recent transcript are required.',
  ].join('\n'),
};

export const SAMPLE_OPPORTUNITY_2: OpportunityInput = {
  title: 'Data Analyst Intern — CityHealth (Remote) [SAMPLE]',
  source: 'Sample opportunity — fictional company, included with the demo',
  description: [
    'CityHealth is hiring a remote Data Analyst Intern for the autumn project cycle.',
    'Requirements:',
    "- Bachelor's degree in Computer Science, Statistics, Mathematics, or a related field.",
    '- Minimum CGPA of 7.0/10.',
    '- Strong skills in SQL and Excel.',
    '- Available for at least 3 months.',
    '- A current resume is required.',
  ].join('\n'),
};

export const SAMPLE_OPPORTUNITIES: OpportunityInput[] = [SAMPLE_OPPORTUNITY_1, SAMPLE_OPPORTUNITY_2];

export const MANUAL_OPPORTUNITY_TEMPLATE: OpportunityInput = {
  title: '',
  source: '',
  description: '',
};
