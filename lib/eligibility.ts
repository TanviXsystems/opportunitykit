import { EvaluatedRequirement, EligibilityStatus, Requirement, StudentProfile } from './types';
import { STATUS_DEFINITION } from './status';

/**
 * Eligibility engine — explicit, testable rules.
 *
 * Each rule reads exactly the profile fields it needs and returns one of
 * three states with a plain-language explanation:
 *   MATCH    — the profile contains the information and satisfies the rule
 *   MISMATCH — the profile contains the information and fails the rule (a confirmed no)
 *   MISSING  — the profile does not contain the information needed to decide
 *
 * The distinguishing principle: "Missing information is not the same as
 * ineligibility." A MISSING result never means "rejected" — it means
 * "confirm this to complete the check".
 */

export const RULES: Record<string, { title: string; description: string }> = {
  'RULE-DEGREE-01': {
    title: 'Degree & field comparison',
    description:
      'Compares the required degree level and field with the profile. If the listing says "or related field", any degree field passes; otherwise the field must match exactly or belong to the same related group (e.g. Computer Science, IT, Electronics, Mathematics are related for this demo).',
  },
  'RULE-CGPA-01': {
    title: 'CGPA threshold comparison',
    description: 'Compares the profile CGPA (out of 10) against the stated minimum. A CGPA that is not provided produces MISSING INFORMATION, never an automatic fail.',
  },
  'RULE-SKILL-01': {
    title: 'Skill-list membership',
    description:
      'Checks whether the required skill appears in the profile skill list. The skill list is treated as authoritative: a skill absent from it is a confirmed MISMATCH; an empty skill list is MISSING INFORMATION.',
  },
  'RULE-AVAIL-01': {
    title: 'Availability duration comparison',
    description: 'Compares the number of months the student can commit against the required minimum.',
  },
  'RULE-RELOC-01': {
    title: 'Relocation preference comparison',
    description: 'Compares the stated relocation preference with the requirement. No preference set means MISSING INFORMATION.',
  },
  'RULE-AUTH-01': {
    title: 'Work authorization comparison',
    description: 'Compares citizenship / work authorization with the requirement. A general requirement with citizenship on file counts as MATCH.',
  },
  'RULE-DOC-01': {
    title: 'Document presence check',
    description:
      'Checks whether the required document is uploaded on the profile. An uploaded document is a MATCH; a known-but-not-uploaded document is MISSING INFORMATION — the student may well have it, they just have not provided it yet.',
  },
  'RULE-OTHER-01': {
    title: 'Manual review',
    description: 'The demo engine cannot automatically verify this criterion yet, so it is surfaced as MISSING INFORMATION for manual review — never silently passed or failed.',
  },
};

const CS_RELATED_GROUP = [
  'computer science',
  'cse',
  'information technology',
  'it',
  'software engineering',
  'software',
  'data science',
  'computer engineering',
  'electronics',
  'electronics and communication',
  'electrical engineering',
  'electrical',
  'information science',
  'mathematics',
  'statistics',
];

const FIELD_GROUPS: string[][] = [
  CS_RELATED_GROUP,
  ['commerce', 'business administration', 'finance', 'accounting', 'economics'],
  ['mechanical engineering', 'mechanical', 'civil engineering', 'civil', 'chemical engineering'],
  ['arts', 'humanities', 'design', 'mass communication'],
];

const DEGREE_KEYWORDS = [
  { regex: /b\.?\s*tech/, label: 'B.Tech' },
  { regex: /b\.?e\.?\b/, label: 'B.E.' },
  { regex: /bachelor/, label: "Bachelor's" },
  { regex: /m\.?\s*tech/, label: 'M.Tech' },
  { regex: /master/, label: "Master's" },
  { regex: /mba/, label: 'MBA' },
  { regex: /ph\.?d/, label: 'PhD' },
];

const FIELD_KEYWORDS = [
  'computer science',
  'statistics',
  'mathematics',
  'information technology',
  'electronics',
  'electrical',
  'mechanical',
  'civil',
  'commerce',
  'business administration',
  'data science',
  'arts',
  'design',
];

function fieldGroup(field: string): string[] | null {
  const f = field.toLowerCase();
  for (const group of FIELD_GROUPS) {
    if (group.some((g) => f === g || f.includes(g))) return group;
  }
  return null;
}

function fieldMatches(profileField: string, requiredKeyword: string): boolean {
  const pf = profileField.toLowerCase();
  const rk = requiredKeyword.toLowerCase();
  if (pf.includes(rk) || rk.includes(pf)) return true;
  const group = fieldGroup(rk);
  return group !== null && group.some((g) => pf === g || pf.includes(g));
}

function extractFieldKeywords(exp: string): string[] {
  return FIELD_KEYWORDS.filter((kw) => exp.includes(kw));
}

function match(req: Requirement, profileValue: string, explanation: string, ruleId: string): EvaluatedRequirement {
  return { ...req, status: 'MATCH', profileValue, explanation, ruleId };
}
function mismatch(req: Requirement, profileValue: string, explanation: string, ruleId: string): EvaluatedRequirement {
  return { ...req, status: 'MISMATCH', profileValue, explanation, ruleId };
}
function missing(req: Requirement, profileValue: string, explanation: string, ruleId: string): EvaluatedRequirement {
  return { ...req, status: 'MISSING', profileValue, explanation, ruleId };
}

export function evaluateRequirement(req: Requirement, profile: StudentProfile): EvaluatedRequirement {
  switch (req.type) {
    case 'degree': {
      if (!profile.degree.trim()) {
        return missing(req, 'not provided', 'Degree is not filled in on the profile, so this requirement cannot be checked yet.', 'RULE-DEGREE-01');
      }
      const exp = req.expected.toLowerCase();
      const requiredKeyword = DEGREE_KEYWORDS.find((k) => k.regex.test(exp));
      const profileDeg = profile.degree.toLowerCase();
      const degreeOk = requiredKeyword ? requiredKeyword.regex.test(profileDeg) || (requiredKeyword.label === "Bachelor's" && /b\.?tech|b\.?e/.test(profileDeg)) : true;
      if (!degreeOk) {
        return mismatch(
          req,
          `${profile.degree} in ${profile.degreeField}`,
          `Your degree (${profile.degree}) does not match the required degree level (${requiredKeyword?.label ?? req.expected}).`,
          'RULE-DEGREE-01'
        );
      }
      const fields = extractFieldKeywords(exp);
      if (fields.length === 0 || exp.includes('related field') || exp.includes('any')) {
        return match(req, `${profile.degree} in ${profile.degreeField}`, `Your degree (${profile.degree} in ${profile.degreeField}) satisfies the stated degree requirement.`, 'RULE-DEGREE-01');
      }
      const ok = fields.some((kw) => fieldMatches(profile.degreeField, kw));
      return ok
        ? match(req, `${profile.degree} in ${profile.degreeField}`, `Your field (${profile.degreeField}) matches one of the accepted fields (${fields.join(', ')}).`, 'RULE-DEGREE-01')
        : mismatch(req, `${profile.degree} in ${profile.degreeField}`, `Your field (${profile.degreeField}) is not among the accepted fields (${fields.join(', ')}).`, 'RULE-DEGREE-01');
    }

    case 'cgpa': {
      if (profile.cgpa === null) {
        return missing(req, 'not provided', 'CGPA is not filled in on the profile, so this requirement cannot be checked yet. Adding it completes the check — it is not an automatic rejection.', 'RULE-CGPA-01');
      }
      const min = parseFloat(req.expected.replace('>=', ''));
      return profile.cgpa >= min
        ? match(req, `${profile.cgpa.toFixed(1)}/10`, `Your CGPA of ${profile.cgpa.toFixed(1)}/10 meets the required minimum of ${min}/10.`, 'RULE-CGPA-01')
        : mismatch(req, `${profile.cgpa.toFixed(1)}/10`, `Your CGPA of ${profile.cgpa.toFixed(1)}/10 is below the required minimum of ${min}/10. This is a confirmed gap, not missing data.`, 'RULE-CGPA-01');
    }

    case 'skill': {
      if (profile.skills.length === 0) {
        return missing(req, 'no skills listed', 'No skills are listed on the profile yet, so this cannot be verified. Add your skills to complete the check.', 'RULE-SKILL-01');
      }
      const has = profile.skills.some((s) => s.trim().toLowerCase() === req.expected.toLowerCase());
      return has
        ? match(req, profile.skills.join(', '), `Your profile lists “${req.expected}” among your skills.`, 'RULE-SKILL-01')
        : mismatch(req, profile.skills.join(', '), `Your profile does not list “${req.expected}”. Because your skill list is authoritative, this is a confirmed mismatch — not missing information.`, 'RULE-SKILL-01');
    }

    case 'availability': {
      if (profile.availableDurationMonths === null) {
        return missing(req, 'not provided', 'Your available duration is not set on the profile. Tell us how long you can commit to turn this unknown into a confirmed result.', 'RULE-AVAIL-01');
      }
      const need = parseInt(req.expected.replace('>=', ''), 10);
      return profile.availableDurationMonths >= need
        ? match(req, `${profile.availableDurationMonths} months`, `You are available for ${profile.availableDurationMonths} months; the role needs at least ${need}.`, 'RULE-AVAIL-01')
        : mismatch(req, `${profile.availableDurationMonths} months`, `You are available for ${profile.availableDurationMonths} months, but the role needs at least ${need}. This is a confirmed gap.`, 'RULE-AVAIL-01');
    }

    case 'relocation': {
      if (profile.willingToRelocate === null) {
        return missing(req, 'not provided', 'Your relocation preference is not set on the profile. Set it to complete this check.', 'RULE-RELOC-01');
      }
      return profile.willingToRelocate
        ? match(req, 'willing to relocate', 'You are willing to relocate, which satisfies this requirement.', 'RULE-RELOC-01')
        : mismatch(req, 'not willing to relocate', 'You have indicated you are not willing to relocate, so this requirement is not met.', 'RULE-RELOC-01');
    }

    case 'work_authorization': {
      if (!profile.citizenship.trim()) {
        return missing(req, 'not provided', 'Citizenship / work authorization is not set on the profile.', 'RULE-AUTH-01');
      }
      const exp = req.expected.toLowerCase();
      if (exp === 'unspecified') {
        return match(req, profile.citizenship, `The requirement is general; your citizenship (${profile.citizenship}) is on file.`, 'RULE-AUTH-01');
      }
      const hit = profile.citizenship.toLowerCase().includes(exp) || exp.includes(profile.citizenship.toLowerCase());
      return hit
        ? match(req, profile.citizenship, `Your citizenship (${profile.citizenship}) satisfies the stated work-authorization requirement (${req.expected}).`, 'RULE-AUTH-01')
        : mismatch(req, profile.citizenship, `Your citizenship (${profile.citizenship}) does not meet the stated work-authorization requirement (${req.expected}).`, 'RULE-AUTH-01');
    }

    case 'document': {
      const key = req.expected === 'resume' ? 'resume' : req.expected === 'transcript' ? 'transcript' : req.expected === 'passport' ? 'passport' : null;
      if (!key) {
        return missing(req, 'not tracked', `“${req.text}” is not tracked in the demo profile yet, so it cannot be verified automatically. Confirm it manually — absence of evidence is not evidence of absence.`, 'RULE-DOC-01');
      }
      const uploaded = profile.documents[key];
      return uploaded
        ? match(req, `${req.expected} uploaded`, `Your ${req.expected} is uploaded on the profile.`, 'RULE-DOC-01')
        : missing(req, `${req.expected} not uploaded`, `Your ${req.expected} is not uploaded yet. Uploading it turns this unknown into a confirmed result — it is not a rejection.`, 'RULE-DOC-01');
    }

    default:
      return missing(req, 'cannot verify automatically', 'The demo engine cannot automatically verify this criterion yet, so it is surfaced for manual review rather than silently passed or failed.', 'RULE-OTHER-01');
  }
}

export function containsAllStatuses(results: EvaluatedRequirement[]): boolean {
  const set = new Set(results.map((r) => r.status));
  return set.has('MATCH') && set.has('MISMATCH') && set.has('MISSING');
}

export function countByStatus(results: EvaluatedRequirement[]): Record<EligibilityStatus, number> {
  const counts: Record<EligibilityStatus, number> = { MATCH: 0, MISMATCH: 0, MISSING: 0 };
  for (const r of results) counts[r.status] += 1;
  return counts;
}

export { STATUS_DEFINITION };
