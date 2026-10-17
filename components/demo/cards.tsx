'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { countByStatus } from '@/lib/eligibility';
import { ProfileFormSchema } from '@/lib/schemas';
import { STATUS_DOT_CLASS } from '@/lib/status';
import {
  ChecklistItem,
  EvaluatedRequirement,
  OpportunityInput,
  Requirement,
  RequirementType,
  StudentProfile,
} from '@/lib/types';

/* ---------- shared bits ---------- */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SummaryBar({ results }: { results: EvaluatedRequirement[] }) {
  const counts = countByStatus(results);
  return (
    <div className="flex flex-wrap items-center gap-2" aria-live="polite">
      {(['MATCH', 'MISMATCH', 'MISSING'] as const).map((s) => (
        <span
          key={s}
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_CLASS[s]}`} aria-hidden="true" />
          {s === 'MISSING' ? 'Missing information' : s === 'MATCH' ? 'Match' : 'Mismatch'}:{' '}
          <strong>{counts[s]}</strong>
        </span>
      ))}
      <span className="text-sm text-slate-500">
        Missing information is not ineligibility — each unknown becomes a checklist item.
      </span>
    </div>
  );
}

export function RequirementCard({
  requirement,
  evaluated,
  onWhy,
  onRemove,
}: {
  requirement: Requirement;
  evaluated?: EvaluatedRequirement;
  onWhy?: (er: EvaluatedRequirement) => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">{requirement.text}</p>
          <p className="mt-1 text-xs text-slate-500">
            Type: <span className="font-medium text-slate-600">{requirement.type.replace('_', ' ')}</span>
            {' · '}Expects: <span className="font-medium text-slate-600">{requirement.expected}</span>
            {' · '}Source:{' '}
            <span className="font-medium text-slate-600">
              {requirement.source === 'parsed' ? 'extracted from description' : 'added manually'}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onRemove && (
            <button
              onClick={() => onRemove(requirement.id)}
              aria-label={`Remove requirement ${requirement.text}`}
              className="rounded-md px-1.5 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
            >
              ✕
            </button>
          )}
          {evaluated ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                evaluated.status === 'MATCH'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : evaluated.status === 'MISMATCH'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {evaluated.status === 'MATCH' ? '✓' : evaluated.status === 'MISMATCH' ? '✕' : '?'}
              {evaluated.status === 'MISSING' ? 'MISSING INFORMATION' : evaluated.status}
            </span>
          ) : null}
          {evaluated && onWhy ? (
            <button
              onClick={() => onWhy(evaluated)}
              className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Why this status?
            </button>
          ) : null}
        </div>
      </div>
      {evaluated && <p className="mt-2 text-sm text-slate-600">{evaluated.explanation}</p>}
    </li>
  );
}

/* ---------- guide panel (the 11-step demo sequence) ---------- */

export const GUIDE_STEPS: string[] = [
  'Opened the OpportunityKit landing page',
  'Launched the demo (no registration needed)',
  'Loaded the fictional student profile',
  'Opened a sample internship (or added one manually)',
  'Extracted and reviewed the opportunity requirements',
  'Ran the eligibility analysis',
  'Viewed MATCH, MISMATCH and MISSING INFORMATION results',
  'Opened a requirement to see why its status was assigned',
  'Generated the preparation checklist',
  'Marked a checklist item complete (progress is saved)',
  'Updated profile information and re-ran the analysis',
];

export function GuidePanel({ done }: { done: Set<number> }) {
  const count = done.size;
  return (
    <section aria-label="Demo guide" className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-indigo-900">Judge demo guide — {count}/{GUIDE_STEPS.length} steps</h2>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-indigo-200" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={GUIDE_STEPS.length}>
          <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${(count / GUIDE_STEPS.length) * 100}%` }} />
        </div>
      </div>
      <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {GUIDE_STEPS.map((label, i) => {
          const n = i + 1;
          const isDone = done.has(n);
          return (
            <li key={n} className="flex items-start gap-2 text-xs text-slate-700">
              <span
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isDone ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-400'
                }`}
                aria-hidden="true"
              >
                {isDone ? '✓' : n}
              </span>
              <span className={isDone ? 'text-slate-500 line-through' : ''}>{label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- profile panel ---------- */

const DEGREE_OPTIONS = ['B.Tech', 'B.E.', "Bachelor's", 'M.Tech', "Master's", 'MBA', 'Other'];
const YEAR_OPTIONS = ['1st year', '2nd year', '3rd year', '4th year', 'Final year', 'Graduate'];

interface ProfileFormErrors {
  [key: string]: string;
}

function toForm(p: StudentProfile) {
  return {
    name: p.name,
    degree: p.degree,
    degreeField: p.degreeField,
    year: p.year,
    expectedGraduation: p.expectedGraduation,
    cgpa: p.cgpa === null ? '' : String(p.cgpa),
    skills: p.skills.join(', '),
    location: p.location,
    availableDurationMonths: p.availableDurationMonths === null ? '' : String(p.availableDurationMonths),
    willingToRelocate: p.willingToRelocate === null ? 'unknown' : p.willingToRelocate ? 'yes' : 'no',
    citizenship: p.citizenship,
    resume: p.documents.resume,
    transcript: p.documents.transcript,
    passport: p.documents.passport,
  };
}

export function ProfilePanel({
  profile,
  revision,
  onSave,
}: {
  profile: StudentProfile;
  revision: number;
  onSave: (p: StudentProfile) => void;
}) {
  const [form, setForm] = useState(toForm(profile));
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  useEffect(() => {
    setForm(toForm(profile));
    setErrors({});
  }, [revision]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    const parsed = ProfileFormSchema.safeParse(form);
    if (!parsed.success) {
      const e: ProfileFormErrors = {};
      for (const issue of parsed.error.issues) e[issue.path[0]] = issue.message;
      setErrors(e);
      return;
    }
    onSave({
      name: form.name,
      degree: form.degree,
      degreeField: form.degreeField,
      year: form.year,
      expectedGraduation: form.expectedGraduation,
      cgpa: form.cgpa === '' ? null : parseFloat(form.cgpa),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      location: form.location,
      availableDurationMonths: form.availableDurationMonths === '' ? null : parseInt(form.availableDurationMonths, 10),
      willingToRelocate: form.willingToRelocate === 'unknown' ? null : form.willingToRelocate === 'yes',
      citizenship: form.citizenship,
      documents: { resume: form.resume, transcript: form.transcript, passport: form.passport },
    });
  };

  const input =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';
  const err = (k: string) =>
    errors[k] ? <p className="mt-1 text-xs text-rose-600" role="alert">{errors[k]}</p> : null;
  const label = (htmlFor: string, text: string) => (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-slate-700">
      {text}
    </label>
  );

  return (
    <section aria-label="Student profile" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Student profile</h2>
      <p className="mt-1 text-xs text-slate-500">Fictional demo data — edit anything, then re-run the analysis.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          {label('p-name', 'Name')}
          <input id="p-name" className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
          {err('name')}
        </div>
        <div>
          {label('p-degree', 'Degree')}
          <select id="p-degree" className={input} value={form.degree} onChange={(e) => set('degree', e.target.value)}>
            {DEGREE_OPTIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          {label('p-field', 'Field of study')}
          <input id="p-field" className={input} value={form.degreeField} onChange={(e) => set('degreeField', e.target.value)} />
          {err('degreeField')}
        </div>
        <div>
          {label('p-year', 'Current year')}
          <select id="p-year" className={input} value={form.year} onChange={(e) => set('year', e.target.value)}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          {label('p-grad', 'Expected graduation year')}
          <input id="p-grad" className={input} value={form.expectedGraduation} onChange={(e) => set('expectedGraduation', e.target.value)} />
          {err('expectedGraduation')}
        </div>
        <div>
          {label('p-cgpa', 'CGPA (out of 10)')}
          <input id="p-cgpa" inputMode="decimal" placeholder="e.g. 7.2 — blank = unknown" className={input} value={form.cgpa} onChange={(e) => set('cgpa', e.target.value)} />
          {err('cgpa')}
        </div>
        <div className="sm:col-span-2">
          {label('p-skills', 'Skills (comma separated)')}
          <input id="p-skills" className={input} value={form.skills} onChange={(e) => set('skills', e.target.value)} />
          {err('skills')}
        </div>
        <div>
          {label('p-location', 'Location')}
          <input id="p-location" className={input} value={form.location} onChange={(e) => set('location', e.target.value)} />
          {err('location')}
        </div>
        <div>
          {label('p-avail', 'Available duration (months)')}
          <input id="p-avail" inputMode="numeric" placeholder="blank = unknown" className={input} value={form.availableDurationMonths} onChange={(e) => set('availableDurationMonths', e.target.value)} />
          {err('availableDurationMonths')}
        </div>
        <div>
          {label('p-reloc', 'Willing to relocate?')}
          <select id="p-reloc" className={input} value={form.willingToRelocate} onChange={(e) => set('willingToRelocate', e.target.value)}>
            <option value="unknown">Not provided</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          {label('p-citizen', 'Citizenship / work authorization')}
          <input id="p-citizen" className={input} value={form.citizenship} onChange={(e) => set('citizenship', e.target.value)} />
          {err('citizenship')}
        </div>
      </div>
      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-slate-700">Documents uploaded</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(
            [
              ['resume', 'Resume'],
              ['transcript', 'Transcript'],
              ['passport', 'Passport'],
            ] as const
          ).map(([key, text]) => (
            <label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {text}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        onClick={save}
        className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Save profile & re-run analysis
      </button>
    </section>
  );
}

/* ---------- opportunity panel ---------- */

export function OpportunityPanel({
  opportunity,
  samples,
  onOpenSample,
  onAddManual,
}: {
  opportunity: OpportunityInput | null;
  samples: OpportunityInput[];
  onOpenSample: (o: OpportunityInput) => void;
  onAddManual: (o: OpportunityInput) => void;
}) {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const parsed = z
      .object({
        title: z.string().min(3, 'Title needs at least 3 characters.'),
        source: z.string().max(200).optional().default(''),
        description: z
          .string()
          .min(40, 'Add at least a short description (40+ characters) so requirements can be extracted.'),
      })
      .safeParse({ title, source, description });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path[0]] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    onAddManual({ title: parsed.data.title, source: parsed.data.source, description: parsed.data.description });
  };

  const input =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <section aria-label="Opportunity" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Opportunity</h2>

      <h3 className="mt-3 text-sm font-medium text-slate-800">Sample opportunities (fictional)</h3>
      <div className="mt-2 grid gap-2">
        {samples.map((s) => {
          const active = opportunity?.title === s.title;
          return (
            <button
              key={s.title}
              onClick={() => onOpenSample(s)}
              aria-pressed={active}
              className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">Sample</span>
                <span className="text-sm font-semibold text-slate-900">{s.title}</span>
              </span>
              <span className="mt-1 block text-xs text-slate-500">{s.source}</span>
            </button>
          );
        })}
      </div>

      <details className="mt-4 rounded-lg border border-slate-200">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          Add an opportunity manually
        </summary>
        <div className="grid gap-3 border-t border-slate-200 p-4">
          <div>
            <label htmlFor="o-title" className="mb-1 block text-xs font-medium text-slate-700">Title *</label>
            <input id="o-title" className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Marketing Intern — Acme Corp" />
            {errors.title && <p className="mt-1 text-xs text-rose-600" role="alert">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="o-source" className="mb-1 block text-xs font-medium text-slate-700">Source (publisher or URL — optional)</label>
            <input id="o-source" className={input} value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. college noticeboard" />
          </div>
          <div>
            <label htmlFor="o-desc" className="mb-1 block text-xs font-medium text-slate-700">Description with requirements *</label>
            <textarea id="o-desc" rows={5} className={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={'Paste the internship description.\nTip: lines like "- Minimum CGPA of 7.5/10" or "- Proficiency in Python is required" are recognized automatically.'} />
            {errors.description && <p className="mt-1 text-xs text-rose-600" role="alert">{errors.description}</p>}
          </div>
          <button
            onClick={submit}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add opportunity
          </button>
        </div>
      </details>
    </section>
  );
}

/* ---------- requirements panel ---------- */

const TYPE_OPTIONS: RequirementType[] = ['degree', 'cgpa', 'skill', 'availability', 'relocation', 'work_authorization', 'document', 'other'];

export function RequirementsPanel({
  requirements,
  onExtract,
  onAddManual,
}: {
  requirements: Requirement[];
  onExtract: () => void;
  onAddManual: (r: Requirement) => void;
}) {
  const [type, setType] = useState<RequirementType>('skill');
  const [text, setText] = useState('');
  const [expected, setExpected] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addManual = () => {
    if (text.trim().length < 5) {
      setError('Describe the requirement in at least 5 characters.');
      return;
    }
    onAddManual({
      id: `manual-${Date.now().toString(36)}`,
      type,
      text: text.trim(),
      expected: expected.trim() || 'unspecified',
      source: 'manual',
    });
    setText('');
    setExpected('');
    setError(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {requirements.length} structured requirement(s) — schema-validated before analysis.
        </p>
        <button
          onClick={onExtract}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Re-extract from description
        </button>
      </div>

      <details className="mt-4 rounded-lg border border-slate-200">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          Add a requirement manually
        </summary>
        <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-3">
          <div>
            <label htmlFor="m-type" className="mb-1 block text-xs font-medium text-slate-700">Type</label>
            <select id="m-type" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" value={type} onChange={(e) => setType(e.target.value as RequirementType)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="m-text" className="mb-1 block text-xs font-medium text-slate-700">Requirement *</label>
            <input id="m-text" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Proficiency in Java" />
          </div>
          <div>
            <label htmlFor="m-expected" className="mb-1 block text-xs font-medium text-slate-700">Normalized expectation</label>
            <input id="m-expected" className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="e.g. Java" />
          </div>
          <div className="sm:col-span-3">
            <button onClick={addManual} className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700">
              Add requirement
            </button>
            {error && <p className="mt-2 text-xs text-rose-600" role="alert">{error}</p>}
          </div>
        </div>
      </details>
    </div>
  );
}

/* ---------- checklist panel ---------- */

export function ChecklistPanel({
  items,
  onToggle,
}: {
  items: ChecklistItem[] | null;
  onToggle: (id: string) => void;
}) {
  if (!items) return null;
  const done = items.filter((i) => i.done).length;
  const pct = items.length === 0 ? 100 : Math.round((done / items.length) * 100);

  return (
    <section aria-label="Preparation checklist" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Preparation checklist</h2>
        <span className="text-sm font-medium text-slate-700" aria-live="polite">
          {done}/{items.length} complete · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      {items.length === 0 ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Nothing to prepare — every requirement is a confirmed MATCH.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2">
          {items.map((item) => (
            <li key={item.id} className={`rounded-lg border px-3 py-2.5 ${item.done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={item.done ? 'text-sm text-slate-500 line-through' : 'text-sm text-slate-800'}>{item.text}</span>
              </label>
              <p className="mt-1 pl-6 text-xs text-slate-500">
                <span className={`mr-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.kind === 'improve' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>
                  {item.kind === 'improve' ? 'improve' : 'confirm'}
                </span>
                {item.suggestion}
              </p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-slate-500">Checklist progress is saved in this browser (demo storage).</p>
    </section>
  );
}
