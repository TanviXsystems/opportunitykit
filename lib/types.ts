/**
 * OpportunityKit core domain types.
 *
 * These types define the data model used across the prototype:
 * student profiles, opportunity inputs, extracted requirements,
 * evaluated (explained) results, and preparation checklist items.
 */

/** The three-state eligibility outcome. */
export type EligibilityStatus = 'MATCH' | 'MISMATCH' | 'MISSING';

/** Categories of requirement the demo engine understands. */
export type RequirementType =
  | 'degree'
  | 'cgpa'
  | 'skill'
  | 'availability'
  | 'relocation'
  | 'work_authorization'
  | 'document'
  | 'other';

/** A single opportunity requirement, either parsed from text or added manually. */
export interface Requirement {
  id: string;
  type: RequirementType;
  /** Human-readable requirement text (what the opportunity asks for). */
  text: string;
  /** Normalized expectation used by the rules engine (e.g. ">=7.5", "Python", ">=6 months"). */
  expected: string;
  source: 'parsed' | 'manual';
  /** The original line the requirement was extracted from, when parsed. */
  sourceLine?: string;
}

/** An opportunity as entered by the judge (sample or manual). */
export interface OpportunityInput {
  title: string;
  /** Publisher or URL — display only in the prototype. */
  source: string;
  description: string;
}

/** The fictional demo student profile (editable in the demo). */
export interface StudentProfile {
  name: string;
  degree: string;
  degreeField: string;
  year: string;
  expectedGraduation: string;
  /** CGPA out of 10. null means "not provided". */
  cgpa: number | null;
  skills: string[];
  location: string;
  /** Months the student can commit to. null means "not provided". */
  availableDurationMonths: number | null;
  /** null means "not provided". */
  willingToRelocate: boolean | null;
  citizenship: string;
  documents: {
    resume: boolean;
    transcript: boolean;
    passport: boolean;
  };
}

/** A requirement after evaluation against a profile, with its explanation. */
export interface EvaluatedRequirement extends Requirement {
  status: EligibilityStatus;
  /** The profile value that was actually compared, for transparency. */
  profileValue: string;
  /** Plain-language explanation of why this status was assigned. */
  explanation: string;
  /** Identifier of the explicit rule that produced the status (see RULES). */
  ruleId: string;
}

/** An actionable preparation item derived from a non-MATCH result. */
export interface ChecklistItem {
  id: string;
  requirementId: string;
  kind: 'improve' | 'confirm';
  text: string;
  suggestion: string;
  done: boolean;
}
