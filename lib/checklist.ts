import { ChecklistItem, EvaluatedRequirement, RequirementType } from './types';

/**
 * Preparation checklist generation.
 *
 * Every non-MATCH result becomes exactly one actionable item:
 *   MISMATCH  → "improve" item (work on the gap)
 *   MISSING   → "confirm" item (provide the information)
 * MATCH results never appear on the checklist — nothing to prepare.
 */

const SUGGESTIONS: Partial<Record<RequirementType, string>> = {
  cgpa: 'CGPA usually cannot change quickly — consider roles with a lower cutoff, or highlight projects and internships that demonstrate your skills.',
  skill: 'A focused course, tutorial, or a small project can build this skill. Add it to your profile only once you can demonstrate it.',
  availability: 'Add your available duration under Profile → Availability, then re-run the analysis.',
  relocation: 'Set your relocation preference under Profile → Preferences, then re-run the analysis.',
  document: 'Upload the document in your profile to confirm it and complete the check.',
  degree: 'Check whether your degree field counts as “related” for this role, or look for roles aligned with your degree.',
  work_authorization: 'Confirm your work-authorization status in your profile.',
  other: 'Review this criterion manually and note how you meet it before applying.',
};

export function buildChecklist(results: EvaluatedRequirement[]): ChecklistItem[] {
  return results
    .filter((r) => r.status !== 'MATCH')
    .map((r) =>
      r.status === 'MISMATCH'
        ? {
            id: `cl-${r.id}`,
            requirementId: r.id,
            kind: 'improve' as const,
            text: `Address mismatch — ${r.text}`,
            suggestion: SUGGESTIONS[r.type] ?? 'Review this requirement and plan how to meet it before applying.',
            done: false,
          }
        : {
            id: `cl-${r.id}`,
            requirementId: r.id,
            kind: 'confirm' as const,
            text: `Confirm information — ${r.text}`,
            suggestion: SUGGESTIONS[r.type] ?? 'Provide the requested information to complete the eligibility check.',
            done: false,
          }
    );
}
