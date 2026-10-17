import { describe, expect, it } from 'vitest';
import { evaluateRequirement } from './eligibility';
import { DEFAULT_PROFILE } from './demo-data';
import { Requirement, StudentProfile } from './types';

function req(partial: Partial<Requirement> & Pick<Requirement, 'type' | 'expected'>): Requirement {
  return { id: 't', text: partial.expected, source: 'manual', ...partial };
}

describe('eligibility rules engine', () => {
  it('MATCH: degree + field satisfied', () => {
    const r = evaluateRequirement(req({ type: 'degree', expected: 'b.tech in computer science or a related field' }), DEFAULT_PROFILE);
    expect(r.status).toBe('MATCH');
    expect(r.explanation).toContain('Computer Science');
  });

  it('MISMATCH: CGPA below threshold is a confirmed gap', () => {
    const r = evaluateRequirement(req({ type: 'cgpa', expected: '>=7.5' }), DEFAULT_PROFILE);
    expect(r.status).toBe('MISMATCH');
    expect(r.explanation).toContain('7.2');
    expect(r.explanation).toContain('7.5');
  });

  it('MATCH: CGPA meets threshold', () => {
    const p: StudentProfile = { ...DEFAULT_PROFILE, cgpa: 8.0 };
    const r = evaluateRequirement(req({ type: 'cgpa', expected: '>=7.5' }), p);
    expect(r.status).toBe('MATCH');
  });

  it('MISSING: CGPA absent is unknown, not a rejection', () => {
    const p: StudentProfile = { ...DEFAULT_PROFILE, cgpa: null };
    const r = evaluateRequirement(req({ type: 'cgpa', expected: '>=7.5' }), p);
    expect(r.status).toBe('MISSING');
    expect(r.explanation).toContain('not');
  });

  it('skill present → MATCH, absent → MISMATCH, empty list → MISSING', () => {
    expect(evaluateRequirement(req({ type: 'skill', expected: 'Python' }), DEFAULT_PROFILE).status).toBe('MATCH');
    expect(evaluateRequirement(req({ type: 'skill', expected: 'ROS' }), DEFAULT_PROFILE).status).toBe('MISMATCH');
    const p: StudentProfile = { ...DEFAULT_PROFILE, skills: [] };
    expect(evaluateRequirement(req({ type: 'skill', expected: 'Python' }), p).status).toBe('MISSING');
  });

  it('availability: null → MISSING, enough → MATCH, not enough → MISMATCH', () => {
    const base = req({ type: 'availability', expected: '>=6 months' });
    expect(evaluateRequirement(base, DEFAULT_PROFILE).status).toBe('MISSING');
    expect(evaluateRequirement(base, { ...DEFAULT_PROFILE, availableDurationMonths: 6 }).status).toBe('MATCH');
    expect(evaluateRequirement(base, { ...DEFAULT_PROFILE, availableDurationMonths: 3 }).status).toBe('MISMATCH');
  });

  it('relocation: null → MISSING, true → MATCH, false → MISMATCH', () => {
    const base = req({ type: 'relocation', expected: 'yes' });
    expect(evaluateRequirement(base, DEFAULT_PROFILE).status).toBe('MISSING');
    expect(evaluateRequirement(base, { ...DEFAULT_PROFILE, willingToRelocate: true }).status).toBe('MATCH');
    expect(evaluateRequirement(base, { ...DEFAULT_PROFILE, willingToRelocate: false }).status).toBe('MISMATCH');
  });

  it('documents: uploaded → MATCH, not uploaded → MISSING (evidence missing, not ability)', () => {
    const resume = req({ type: 'document', expected: 'resume' });
    const transcript = req({ type: 'document', expected: 'transcript' });
    expect(evaluateRequirement(resume, DEFAULT_PROFILE).status).toBe('MATCH');
    expect(evaluateRequirement(transcript, DEFAULT_PROFILE).status).toBe('MISSING');
    const p: StudentProfile = { ...DEFAULT_PROFILE, documents: { resume: true, transcript: true, passport: false } };
    expect(evaluateRequirement(transcript, p).status).toBe('MATCH');
  });

  it('work authorization compares citizenship', () => {
    const india = req({ type: 'work_authorization', expected: 'India' });
    expect(evaluateRequirement(india, DEFAULT_PROFILE).status).toBe('MATCH');
    const usa = req({ type: 'work_authorization', expected: 'USA' });
    expect(evaluateRequirement(usa, DEFAULT_PROFILE).status).toBe('MISMATCH');
  });

  it('degree field outside the related group → MISMATCH', () => {
    const p: StudentProfile = { ...DEFAULT_PROFILE, degreeField: 'Hotel Management' };
    const r = evaluateRequirement(req({ type: 'degree', expected: "bachelor's in computer science" }), p);
    expect(r.status).toBe('MISMATCH');
  });

  it('every rule id resolves to a documented rule', () => {
    const reqs: Requirement[] = [
      req({ type: 'degree', expected: 'b.tech in computer science or a related field' }),
      req({ type: 'cgpa', expected: '>=7.5' }),
      req({ type: 'skill', expected: 'Python' }),
      req({ type: 'availability', expected: '>=6 months' }),
      req({ type: 'relocation', expected: 'yes' }),
      req({ type: 'work_authorization', expected: 'India' }),
      req({ type: 'document', expected: 'resume' }),
      req({ type: 'other', expected: 'unspecified' }),
    ];
    for (const r of reqs) {
      const result = evaluateRequirement(r, DEFAULT_PROFILE);
      expect(result.ruleId).toMatch(/^RULE-[A-Z]+-\d+$/);
      expect(result.explanation.length).toBeGreaterThan(10);
      expect(['MATCH', 'MISMATCH', 'MISSING']).toContain(result.status);
    }
  });
});
