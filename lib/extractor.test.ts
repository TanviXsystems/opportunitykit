import { describe, expect, it } from 'vitest';
import { extractRequirements } from './extractor';
import { SAMPLE_OPPORTUNITY_1, SAMPLE_OPPORTUNITY_2 } from './demo-data';

describe('requirement extraction (validated parsing)', () => {
  it('extracts every requirement from the Nova Robotics sample', () => {
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description);
    expect(reqs.length).toBe(10);
    expect(reqs.map((r) => r.type)).toEqual([
      'degree',
      'cgpa',
      'skill',
      'skill',
      'skill',
      'availability',
      'relocation',
      'work_authorization',
      'document',
      'document',
    ]);
  });

  it('normalizes CGPA, availability and authorization expectations', () => {
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description);
    const cgpa = reqs.find((r) => r.type === 'cgpa')!;
    expect(cgpa.expected).toBe('>=7.5');
    const avail = reqs.find((r) => r.type === 'availability')!;
    expect(avail.expected).toBe('>=6 months');
    const auth = reqs.find((r) => r.type === 'work_authorization')!;
    expect(auth.expected).toBe('India');
  });

  it('extracts skills from proficiency sentences', () => {
    const reqs = extractRequirements('X', 'Requirements:\n- Proficiency in Python and React is required.\n- Familiarity with ROS (Robot Operating System) is preferred.');
    const skills = reqs.filter((r) => r.type === 'skill').map((r) => r.expected);
    expect(skills).toEqual(['Python', 'React', 'ROS']);
  });

  it('extracts from the CityHealth sample', () => {
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_2.title, SAMPLE_OPPORTUNITY_2.description);
    expect(reqs.length).toBe(6);
    expect(reqs.find((r) => r.type === 'cgpa')!.expected).toBe('>=7.0');
  });

  it('dedupes repeated identical requirements', () => {
    const reqs = extractRequirements('X', '- Minimum CGPA of 7.5/10.\n- Minimum CGPA of 7.5/10.');
    expect(reqs.filter((r) => r.type === 'cgpa').length).toBe(1);
  });

  it('ignores non-requirement prose', () => {
    const reqs = extractRequirements('X', 'We are a friendly team. Lunch is provided. Apply soon!\nRequirements:\n- Minimum CGPA of 8.0/10.');
    expect(reqs.length).toBe(1);
    expect(reqs[0].type).toBe('cgpa');
  });

  it('captures unrecognised requirement-like lines as "other" instead of dropping them', () => {
    const reqs = extractRequirements('X', '- Must have a curious mindset and a love of robotics.');
    expect(reqs.length).toBe(1);
    expect(reqs[0].type).toBe('other');
  });

  it('returns an empty (validated) list when nothing matches', () => {
    const reqs = extractRequirements('X', 'This is a short blurb with no criteria at all here.');
    expect(reqs).toEqual([]);
  });
});
