'use client';

import { useState } from 'react';
import { evaluateRequirement } from '@/lib/eligibility';
import { DEFAULT_PROFILE } from '@/lib/demo-data';
import { Requirement } from '@/lib/types';
import StatusBadge from './StatusBadge';

/**
 * Interactive demonstration of the distinguishing principle:
 * "Missing information is not the same as ineligibility."
 * Uses the real eligibility engine — this is not a mock-up.
 */
const DEMO_REQUIREMENT: Requirement = {
  id: 'principle-demo',
  type: 'availability',
  text: 'Must be available for at least 6 months',
  expected: '>=6 months',
  source: 'manual',
};

const OPTIONS: Array<{ value: 'unknown' | '3' | '6'; label: string }> = [
  { value: 'unknown', label: 'Not provided' },
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
];

export default function PrincipleDemo() {
  const [availability, setAvailability] = useState<'unknown' | '3' | '6'>('unknown');

  const result = evaluateRequirement(DEMO_REQUIREMENT, {
    ...DEFAULT_PROFILE,
    availableDurationMonths: availability === 'unknown' ? null : parseInt(availability, 10),
  });

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Try it — a real rule, live</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">Requirement: {DEMO_REQUIREMENT.text}</h3>

      <div className="mt-4" role="group" aria-label="Student availability">
        <p className="mb-2 text-sm font-medium text-slate-700">The student&apos;s availability is:</p>
        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setAvailability(o.value)}
              aria-pressed={availability === o.value}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                availability === o.value
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={result.status} />
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Profile value considered:</span> {result.profileValue}
          </p>
        </div>
        <p className="mt-2 text-sm text-slate-700">{result.explanation}</p>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Notice: when the information is <strong>missing</strong>, OpportunityKit says <em>unknown</em> — never &quot;rejected&quot;.
        The same requirement flips to a <strong>MATCH</strong> the moment the student confirms their availability, and to a
        <strong> MISMATCH </strong> only when the confirmed facts genuinely fall short.
      </p>
    </div>
  );
}
