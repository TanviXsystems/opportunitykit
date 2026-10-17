'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { extractRequirements } from '@/lib/extractor';
import { countByStatus, evaluateRequirement } from '@/lib/eligibility';
import { DEFAULT_PROFILE, SAMPLE_OPPORTUNITY_1 } from '@/lib/demo-data';
import StatusBadge from '@/components/StatusBadge';

/**
 * The "Organize these requirements" payoff.
 *
 * The results below are computed LIVE by the real OpportunityKit
 * extraction + eligibility engine on the fictional sample
 * opportunity — this is not a canned animation. It is an
 * illustrative preview of the first 6 requirements; the full
 * analysis lives in the interactive demo.
 */
export default function OrganizePanel() {
  const results = useMemo(
    () =>
      extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description).map((r) =>
        evaluateRequirement(r, DEFAULT_PROFILE)
      ),
    []
  );
  const counts = countByStatus(results);
  const preview = results.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-6 rounded-2xl border border-teal-500/30 bg-white/95 p-5 text-left shadow-xl backdrop-blur sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Requirements, organized
          </p>
          <h3 className="mt-1 text-lg font-bold text-midnight-900">
            Scattered criteria → structured, explained results
          </h3>
        </div>
        <div className="flex flex-wrap gap-2" aria-live="polite">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" /> {counts.MATCH} match
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden="true" /> {counts.MISMATCH} mismatch
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" /> {counts.MISSING} missing info
          </span>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {preview.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{r.text}</p>
              <p className="mt-0.5 text-xs text-slate-500">{r.explanation}</p>
            </div>
            <StatusBadge status={r.status} size="sm" />
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-slate-500">
        Illustrative preview — computed by the real OpportunityKit eligibility engine on fictional
        sample data ({results.length} requirements extracted; first {preview.length} shown).
      </p>
      <Link
        href="/demo"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        Run the full analysis in the interactive demo
        <span aria-hidden="true">→</span>
      </Link>
    </motion.div>
  );
}
