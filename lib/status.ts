import { EligibilityStatus } from './types';

/**
 * Shared presentation metadata for the three eligibility statuses.
 * Kept in one place so badges, text and colors stay consistent.
 */

export const STATUS_LABEL: Record<EligibilityStatus, string> = {
  MATCH: 'MATCH',
  MISMATCH: 'MISMATCH',
  MISSING: 'MISSING INFORMATION',
};

export const STATUS_BADGE_CLASS: Record<EligibilityStatus, string> = {
  MATCH: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  MISMATCH: 'bg-rose-100 text-rose-800 border-rose-300',
  MISSING: 'bg-amber-100 text-amber-900 border-amber-300',
};

export const STATUS_DOT_CLASS: Record<EligibilityStatus, string> = {
  MATCH: 'bg-emerald-500',
  MISMATCH: 'bg-rose-500',
  MISSING: 'bg-amber-400',
};

export const STATUS_ICON: Record<EligibilityStatus, string> = {
  MATCH: '✓',
  MISMATCH: '✕',
  MISSING: '?',
};

export const STATUS_DEFINITION: Record<EligibilityStatus, string> = {
  MATCH: 'Confirmed: the information on the profile satisfies this requirement.',
  MISMATCH:
    'Confirmed gap: the profile contains the relevant information, and it does not meet this requirement. A mismatch is a confirmed no — not missing data.',
  MISSING:
    'Unknown: the profile does not yet contain the information needed to decide. Missing information is NOT the same as ineligibility — provide it to complete the check.',
};
