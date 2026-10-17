import { ExtractedOpportunitySchema, ExtractedRequirementSchema } from './schemas';
import { Requirement, RequirementType } from './types';

/**
 * Requirement extraction (implemented, deterministic).
 *
 * The prototype ships with a validated rule-based parser that converts a
 * free-text opportunity description into structured, schema-validated
 * requirements. This works fully offline — no paid API, no external account.
 *
 * An optional server-side LLM integration is PLANNED (not configured):
 * the /api/extract endpoint runs this same deterministic parser today and
 * reports llmConfigured: false. See docs and the Technology & Approach
 * section of the landing page. Do not treat an LLM as operational.
 */

const KNOWN_SKILLS = [
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'React',
  'React Native',
  'Node.js',
  'NodeJS',
  'SQL',
  'Git',
  'C++',
  'C',
  'ROS',
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Excel',
  'Power BI',
  'Tableau',
  'HTML',
  'CSS',
  'Figma',
  'CAD',
  'MATLAB',
  'Go',
  'Rust',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Spark',
  'Kafka',
  'Flutter',
  'Swift',
  'Kotlin',
  'PHP',
  'Laravel',
  'Spring',
  'Django',
  'Flask',
  'FastAPI',
  'Pandas',
  'NumPy',
  'OpenCV',
];

let counter = 0;
function nextId(): string {
  counter += 1;
  return `req-${counter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const DOCUMENT_PATTERNS: Array<[RegExp, string]> = [
  [/\bCV\b/i, 'resume'],
  [/\bresume\b/i, 'resume'],
  [/\btranscript\b/i, 'transcript'],
  [/\bmark sheet\b/i, 'transcript'],
  [/\bpassport\b/i, 'passport'],
  [/\bportfolio\b/i, 'portfolio'],
  [/\bletter of recommendation\b|\bLOR\b/i, 'letter of recommendation'],
];

const AUTH_COUNTRIES = ['India', 'Indian', 'USA', 'United States', 'UK', 'Canada', 'Australia', 'Germany'];

/** Extract structured requirements from an opportunity description. */
export function extractRequirements(title: string, description: string): Requirement[] {
  const lines = description
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: Requirement[] = [];
  const seen = new Set<string>();

  const add = (type: RequirementType, text: string, expected: string, sourceLine: string) => {
    const key = `${type}|${expected.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    // Every extracted requirement is validated against the typed schema
    // before it may enter the eligibility engine.
    const parsed = ExtractedRequirementSchema.parse({
      id: nextId(),
      type,
      text,
      expected,
      source: 'parsed',
      sourceLine,
    });
    out.push(parsed);
  };

  for (const raw of lines) {
    const line = raw.replace(/^[-*•\d.)]+\s*/, '').trim();
    let matched = false;

    // CGPA / GPA threshold, e.g. "Minimum CGPA of 7.5/10"
    const cgpa = line.match(/(?:minimum\s+|at least\s+)?(?:CGPA|GPA)\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*(?:\/\s*\d+|out of \d+)?/i);
    if (cgpa) {
      add('cgpa', `Minimum CGPA of ${cgpa[1]}/10`, `>=${cgpa[1]}`, line);
      matched = true;
    }

    // Degree, e.g. "B.Tech in Computer Science or a related field".
    // NOTE: "BE" is matched case-sensitively so the ordinary word
    // "be" (e.g. "Must be available…") is never misread as a B.E. degree.
    const deg = line.match(
      /\b(B\.?\s*[Tt]ech|B\.E\.|\bBE\b|[Bb]achelor(?:'s)?(?:\s+[A-Za-z]+){0,3}|M\.?\s*[Tt]ech|[Mm]aster(?:'s)?(?:\s+[A-Za-z]+){0,3}|MBA|Ph\.?D)\b/
    );
    if (deg && !/(proficien|experience|skills? in|familiar)/i.test(line)) {
      add('degree', line, line.toLowerCase(), line);
      matched = true;
    }

    // Skills, on lines that describe proficiency
    if (/(proficien\w*|familiar\w*|experience (?:with|in)|knowledge of|strong (?:in|at)|skills? in|expert (?:in|at))/i.test(line)) {
      for (const skill of KNOWN_SKILLS) {
        if (new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i').test(line)) {
          add('skill', `Proficiency in ${skill}`, skill, line);
          matched = true;
        }
      }
    }

    // Availability duration, e.g. "available for at least 6 months"
    const avail = line.match(/(?:available for|availability (?:of|for)|commit(?:ment)? (?:of|for))\s*(?:at least\s+)?(\d+)\s*(month|week)/i);
    if (avail) {
      const months =
        avail[2].toLowerCase().startsWith('w') ? Math.max(1, Math.round(parseInt(avail[1], 10) / 4)) : parseInt(avail[1], 10);
      add('availability', `Available for at least ${avail[1]} ${avail[2]}(s)`, `>=${months} months`, line);
      matched = true;
    }

    // Relocation willingness
    if (/relocat|willing to (?:move|relocate)|shift to|open to relocating/i.test(line)) {
      add('relocation', 'Willingness to relocate', 'yes', line);
      matched = true;
    }

    // Work authorization / citizenship
    if (/work authorization|valid visa|work permit|citizenship|nationality/i.test(line)) {
      const country = line.match(/\b(India|Indian|USA|United States|UK|Canada|Australia|Germany)\b/i);
      const normalized = country ? (country[1].toLowerCase() === 'indian' ? 'India' : country[1]) : 'unspecified';
      add('work_authorization', line, normalized, line);
      matched = true;
    }

    // Documents, e.g. "Resume and a recent transcript are required"
    if (/required|must|attach|submit|provide|needed/i.test(line)) {
      for (const [re, doc] of DOCUMENT_PATTERNS) {
        if (re.test(line)) {
          const label = doc === 'resume' ? 'Resume' : doc === 'transcript' ? 'Transcript' : doc === 'passport' ? 'Passport' : doc[0].toUpperCase() + doc.slice(1);
          add('document', `${label} required`, doc, line);
          matched = true;
        }
      }
    }

    // Any other requirement-like sentence is captured as "other" so judges
    // can see it and mark it complete manually — it is never silently dropped.
    if (!matched && /\b(must|should|required|require)\b/i.test(line) && line.length < 220 && !/^(requirements|eligibility|about|description)\b/i.test(line)) {
      add('other', line, 'unspecified', line);
    }
  }

  // Validate the whole extraction output against the typed schema.
  ExtractedOpportunitySchema.parse({ title, source: '', description, requirements: out });
  return out;
}
