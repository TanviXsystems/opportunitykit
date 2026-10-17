import { describe, expect, it } from 'vitest';
import { buildChecklist } from './checklist';
import { evaluateRequirement } from './eligibility';
import { DEFAULT_PROFILE } from './demo-data';
import { extractRequirements } from './extractor';
import { SAMPLE_OPPORTUNITY_1 } from './demo-data';
import { ChecklistItem } from './types';

describe('preparation checklist generation', () => {
  it('creates one item per non-MATCH result and none for MATCHes', () => {
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description);
    const results = reqs.map((r) => evaluateRequirement(r, DEFAULT_PROFILE));
    const items: ChecklistItem[] = buildChecklist(results);
    const nonMatch = results.filter((r) => r.status !== 'MATCH').length;
    expect(items.length).toBe(nonMatch);
    expect(items.map((i) => i.requirementId).sort()).toEqual(
      results.filter((r) => r.status !== 'MATCH').map((r) => r.id).sort()
    );
  });

  it('labels mismatches as improve and missing items as confirm', () => {
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description);
    const results = reqs.map((r) => evaluateRequirement(r, DEFAULT_PROFILE));
    const items = buildChecklist(results);
    const cgpaItem = items.find((i) => i.text.includes('CGPA'))!;
    expect(cgpaItem.kind).toBe('improve');
    const availItem = items.find((i) => i.text.toLowerCase().includes('available for at least'))!;
    expect(availItem.kind).toBe('confirm');
  });

  it('produces an empty checklist when everything matches', () => {
    const p = { ...DEFAULT_PROFILE, cgpa: 9.0, skills: ['Python', 'React', 'ROS'], availableDurationMonths: 6, willingToRelocate: true, documents: { resume: true, transcript: true, passport: true } };
    const reqs = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description);
    const items = buildChecklist(reqs.map((r) => evaluateRequirement(r, p)));
    expect(items).toEqual([]);
  });
});
