'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { extractRequirements } from '@/lib/extractor';
import { evaluateRequirement } from '@/lib/eligibility';
import { STATUS_DEFINITION, STATUS_LABEL } from '@/lib/status';
import { DEFAULT_PROFILE, SAMPLE_OPPORTUNITY_1 } from '@/lib/demo-data';
import { EligibilityStatus } from '@/lib/types';

const STYLE: Record<
  EligibilityStatus,
  { border: string; chip: string; icon: string; title: string }
> = {
  MATCH: {
    border: 'border-emerald-300',
    chip: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '✓',
    title: 'MATCH',
  },
  MISMATCH: {
    border: 'border-rose-300',
    chip: 'bg-rose-100 text-rose-800 border-rose-300',
    icon: '✕',
    title: 'MISMATCH',
  },
  MISSING: {
    border: 'border-amber-300',
    chip: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '?',
    title: 'MISSING INFORMATION',
  },
};

const BLURB: Record<EligibilityStatus, string> = {
  MATCH: 'The available evidence supports the requirement.',
  MISMATCH: 'The available evidence indicates the requirement is not met.',
  MISSING: 'More information is needed before the requirement can be evaluated.',
};

/**
 * The key differentiator, as three interactive status cards.
 * Examples are pulled live from the real engine on sample data.
 */
export default function StatusCards() {
  const [selected, setSelected] = useState<EligibilityStatus | null>(null);
  const reduced = useReducedMotion();

  const examples = useMemo(() => {
    const results = extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description).map((r) =>
      evaluateRequirement(r, DEFAULT_PROFILE)
    );
    return {
      MATCH: results.find((r) => r.status === 'MATCH'),
      MISMATCH: results.find((r) => r.status === 'MISMATCH'),
      MISSING: results.find((r) => r.status === 'MISSING'),
    } as Record<EligibilityStatus, (typeof results)[number] | undefined>;
  }, []);

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {(Object.keys(STYLE) as EligibilityStatus[]).map((status, i) => {
        const s = STYLE[status];
        const example = examples[status];
        const open = selected === status;
        return (
          <motion.button
            key={status}
            type="button"
            aria-expanded={open}
            onClick={() => setSelected(open ? null : status)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className={`rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              open ? `${s.border} ring-2 ring-teal-500/30` : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${s.chip}`}>
              <span aria-hidden="true">{s.icon}</span>
              {s.title}
            </span>
            <h3 className="mt-3 text-lg font-bold text-midnight-900">{s.title === 'MISSING' || s.title === 'MISSING INFORMATION' ? 'Missing information' : s.title === 'MATCH' ? 'A confirmed fit' : 'A confirmed gap'}</h3>
            <p className="mt-1 text-sm text-slate-600">{BLURB[status]}</p>

            <AnimatePresence>
              {open && example && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-xl bg-cream-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Live example — fictional sample data
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-midnight-900">{example.text}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Profile value considered: <span className="font-medium text-slate-700">{example.profileValue}</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{example.explanation}</p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{STATUS_DEFINITION[status]}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-3 text-xs font-medium text-teal-700">
              {open ? 'Tap to collapse' : 'Tap to see a real example'}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
