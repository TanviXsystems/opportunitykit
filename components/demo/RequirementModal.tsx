'use client';

import { useEffect } from 'react';
import { RULES } from '@/lib/eligibility';
import { STATUS_DEFINITION } from '@/lib/status';
import { ChecklistItem, EvaluatedRequirement } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

export default function RequirementModal({
  evaluated,
  checklistItem,
  onClose,
}: {
  evaluated: EvaluatedRequirement;
  checklistItem?: ChecklistItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const rule = RULES[evaluated.ruleId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="req-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <StatusBadge status={evaluated.status} />
            <h2 id="req-modal-title" className="mt-2 text-lg font-semibold text-slate-900">{evaluated.text}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            ✕
          </button>
        </div>

        <dl className="mt-4 grid gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why this status was assigned</dt>
            <dd className="mt-1 text-slate-800">{evaluated.explanation}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rule applied</dt>
            <dd className="mt-1">
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-700">{evaluated.ruleId}</span>
              <span className="ml-2 font-medium text-slate-800">{rule?.title ?? 'Custom rule'}</span>
              <p className="mt-1 text-slate-600">{rule?.description}</p>
            </dd>
          </div>

          <div className="grid gap-1 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requirement expects</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{evaluated.expected}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile value considered</dt>
              <dd className="mt-0.5 font-medium text-slate-800">{evaluated.profileValue}</dd>
            </div>
          </div>

          {evaluated.sourceLine && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Extracted from</dt>
              <dd className="mt-1 rounded-lg border-l-4 border-indigo-300 bg-indigo-50/60 px-3 py-2 text-slate-700 italic">
                “{evaluated.sourceLine}”
              </dd>
            </div>
          )}

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status definition</dt>
            <dd className="mt-1 text-slate-600">{STATUS_DEFINITION[evaluated.status]}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next step</dt>
            <dd className="mt-1 text-slate-700">
              {checklistItem ? (
                <span>
                  <span className={`mr-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${checklistItem.kind === 'improve' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>
                    {checklistItem.kind}
                  </span>
                  {checklistItem.suggestion}
                </span>
              ) : (
                'No action needed — this requirement is satisfied.'
              )}
            </dd>
          </div>
        </dl>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
