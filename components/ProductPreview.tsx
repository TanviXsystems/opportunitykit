'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { extractRequirements } from '@/lib/extractor';
import { countByStatus, evaluateRequirement } from '@/lib/eligibility';
import { STATUS_BADGE_CLASS, STATUS_ICON, STATUS_LABEL } from '@/lib/status';
import { DEFAULT_PROFILE, SAMPLE_OPPORTUNITY_1 } from '@/lib/demo-data';
import { StudentProfile } from '@/lib/types';

/**
 * Working product preview — a compact slice of the real demo,
 * powered by the actual extraction + eligibility engine.
 */
export default function ProductPreview() {
  const [cgpa, setCgpa] = useState('7.2');
  const [skills, setSkills] = useState(DEFAULT_PROFILE.skills.join(', '));
  const [availability, setAvailability] = useState('unknown');
  const [relocate, setRelocate] = useState('unknown');
  const [transcript, setTranscript] = useState(false);

  const results = useMemo(() => {
    const profile: StudentProfile = {
      ...DEFAULT_PROFILE,
      cgpa: cgpa === '' ? null : parseFloat(cgpa),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      availableDurationMonths: availability === 'unknown' ? null : parseInt(availability, 10),
      willingToRelocate: relocate === 'unknown' ? null : relocate === 'yes',
      documents: { ...DEFAULT_PROFILE.documents, transcript },
    };
    return extractRequirements(SAMPLE_OPPORTUNITY_1.title, SAMPLE_OPPORTUNITY_1.description).map((r) =>
      evaluateRequirement(r, profile)
    );
  }, [cgpa, skills, availability, relocate, transcript]);

  const counts = countByStatus(results);
  const input =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-midnight-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-200 bg-cream-100 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Live preview — the real OpportunityKit engine, fictional sample data
        </p>
        <p className="mt-0.5 text-sm text-slate-600">
          Opportunity: {SAMPLE_OPPORTUNITY_1.title}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* profile editor */}
        <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <h3 className="text-sm font-bold text-midnight-900">Student profile (fictional)</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pv-cgpa" className="mb-1 block text-xs font-medium text-slate-700">
                CGPA (out of 10)
              </label>
              <input id="pv-cgpa" inputMode="decimal" className={input} value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="blank = unknown" />
            </div>
            <div>
              <label htmlFor="pv-avail" className="mb-1 block text-xs font-medium text-slate-700">
                Available duration
              </label>
              <select id="pv-avail" className={input} value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="unknown">Not provided</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </div>
            <div>
              <label htmlFor="pv-reloc" className="mb-1 block text-xs font-medium text-slate-700">
                Willing to relocate?
              </label>
              <select id="pv-reloc" className={input} value={relocate} onChange={(e) => setRelocate(e.target.value)}>
                <option value="unknown">Not provided</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="pv-skills" className="mb-1 block text-xs font-medium text-slate-700">
                Skills (comma separated)
              </label>
              <input id="pv-skills" className={input} value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>
          </div>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={transcript}
              onChange={(e) => setTranscript(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Transcript uploaded
          </label>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Tip: raise the CGPA to 8.0, set availability to 6 months, and upload the transcript —
            then watch MISMATCH and MISSING INFORMATION results turn into MATCHes.
          </p>
        </div>

        {/* results */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2" aria-live="polite">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> {counts.MATCH} match
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
              <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" /> {counts.MISMATCH} mismatch
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
              <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" /> {counts.MISSING} missing info
            </span>
          </div>

          <ul className="mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {results.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-cream-50 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-midnight-900">{r.text}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{r.explanation}</p>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_BADGE_CLASS[r.status]}`}>
                  <span aria-hidden="true">{STATUS_ICON[r.status]}</span>
                  {STATUS_LABEL[r.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-cream-100 px-5 py-4">
        <p className="text-xs text-slate-600">
          This preview uses the same engine as the full demo — with persistence, checklist, and
          profile editing.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 rounded-xl bg-midnight-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-midnight-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          Try the Interactive Demo
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
