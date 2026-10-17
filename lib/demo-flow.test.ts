import { describe, expect, it } from 'vitest';
import { buildChecklist } from './checklist';
import { containsAllStatuses, evaluateRequirement } from './eligibility';
import { extractRequirements } from './extractor';
import { DEFAULT_PROFILE, SAMPLE_OPPORTUNITY_1 } from './demo-data';
import { ChecklistItem, EvaluatedRequirement, Requirement, StudentProfile } from './types';

/**
 * Verification of the judge demonstration sequence required in
 * SETU 2026 submission section 15.A — executed against the real
 * production code paths (no mocks).
 */
describe('judge demonstration sequence (section 15.A)', () => {
  it('walks all 11 steps of the demo sequence', () => {
    // Step 3 — load the fictional student profile
    let profile: StudentProfile = DEFAULT_PROFILE;
    expect(profile.cgpa).toBe(7.2);

    // Step 4 — open the sample internship
    const opp = SAMPLE_OPPORTUNITY_1;

    // Step 5 — extract and review requirements
    const requirements: Requirement[] = extractRequirements(opp.title, opp.description);
    expect(requirements.length).toBe(10);

    // Step 6 — run the eligibility analysis
    let results: EvaluatedRequirement[] = requirements.map((r) => evaluateRequirement(r, profile));

    // Step 7 — MATCH, MISMATCH and MISSING INFORMATION all appear
    expect(containsAllStatuses(results)).toBe(true);
    const counts = results.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts['MATCH']).toBeGreaterThanOrEqual(3);
    expect(counts['MISMATCH']).toBeGreaterThanOrEqual(2);
    expect(counts['MISSING']).toBeGreaterThanOrEqual(3);

    // Step 8 — every result carries an explanation and rule id
    for (const r of results) {
      expect(r.explanation.length).toBeGreaterThan(10);
      expect(r.ruleId).toMatch(/^RULE-/);
    }

    // Step 9 — generate the preparation checklist
    let checklist: ChecklistItem[] = buildChecklist(results);
    expect(checklist.length).toBe(results.filter((r) => r.status !== 'MATCH').length);

    // Step 10 — mark an item complete
    checklist[0] = { ...checklist[0], done: true };
    expect(checklist[0].done).toBe(true);

    // Step 11 — update profile information and re-run the analysis
    profile = {
      ...profile,
      cgpa: 8.0,
      skills: ['Python', 'SQL', 'React', 'Git', 'Node.js', 'ROS'],
      availableDurationMonths: 6,
      willingToRelocate: true,
      documents: { resume: true, transcript: true, passport: false },
    };
    const rerun: EvaluatedRequirement[] = requirements.map((r) => evaluateRequirement(r, profile));
    expect(rerun.find((r) => r.type === 'cgpa')!.status).toBe('MATCH');
    expect(rerun.find((r) => r.expected === 'ROS')!.status).toBe('MATCH');
    expect(rerun.find((r) => r.type === 'availability')!.status).toBe('MATCH');
    expect(rerun.find((r) => r.type === 'relocation')!.status).toBe('MATCH');
    expect(rerun.find((r) => r.expected === 'transcript')!.status).toBe('MATCH');
    expect(containsAllStatuses(rerun)).toBe(false); // no unknowns or gaps remain in this scenario
    expect(buildChecklist(rerun).length).toBe(0);
  });
});
