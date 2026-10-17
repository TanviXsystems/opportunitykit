'use client';

import { useEffect, useState } from 'react';
import { buildChecklist } from '@/lib/checklist';
import { containsAllStatuses, evaluateRequirement } from '@/lib/eligibility';
import { extractRequirements } from '@/lib/extractor';
import { clearAll, loadJSON, saveJSON } from '@/lib/store';
import { ChecklistItem, EvaluatedRequirement, OpportunityInput, Requirement, StudentProfile } from '@/lib/types';
import { DEFAULT_PROFILE, SAMPLE_OPPORTUNITIES } from '@/lib/demo-data';
import {
  ChecklistPanel,
  EmptyState,
  GuidePanel,
  OpportunityPanel,
  ProfilePanel,
  RequirementCard,
  RequirementsPanel,
  SummaryBar,
} from './cards';
import RequirementModal from './RequirementModal';

export default function DemoWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [profileRevision, setProfileRevision] = useState(0);
  const [opportunity, setOpportunity] = useState<OpportunityInput | null>(SAMPLE_OPPORTUNITIES[0]);
  const [requirements, setRequirements] = useState<Requirement[] | null>(null);
  const [results, setResults] = useState<EvaluatedRequirement[] | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[] | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [changeNote, setChangeNote] = useState<string | null>(null);
  const [extractNotice, setExtractNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalReq, setModalReq] = useState<EvaluatedRequirement | null>(null);
  const [guide, setGuide] = useState<Set<number>>(new Set());

  // Hydrate persisted demo state once, after mount (avoids SSR/CSR mismatch).
  useEffect(() => {
    setProfile(loadJSON<StudentProfile>('profile', DEFAULT_PROFILE));
    const opp = loadJSON<OpportunityInput | null>('opportunity', null);
    if (opp) setOpportunity(opp);
    setRequirements(loadJSON<Requirement[] | null>('requirements', null));
    setResults(loadJSON<EvaluatedRequirement[] | null>('results', null));
    setChecklist(loadJSON<ChecklistItem[] | null>('checklist', null));
    setGuide(new Set(loadJSON<number[]>('guide', [])));
    setMounted(true);
    // Steps 1–3 are inherently satisfied by opening the demo:
    // landing page visited, demo launched without registration,
    // fictional profile loaded.
    setGuide((prev) => {
      const next = new Set(prev);
      next.add(1);
      next.add(2);
      next.add(3);
      return next;
    });
  }, []);

  useEffect(() => { if (mounted) saveJSON('profile', profile); }, [profile, mounted]);
  useEffect(() => { if (mounted) saveJSON('opportunity', opportunity); }, [opportunity, mounted]);
  useEffect(() => { if (mounted) saveJSON('requirements', requirements); }, [requirements, mounted]);
  useEffect(() => { if (mounted) saveJSON('results', results); }, [results, mounted]);
  useEffect(() => { if (mounted) saveJSON('checklist', checklist); }, [checklist, mounted]);
  useEffect(() => { if (mounted) saveJSON('guide', Array.from(guide)); }, [guide, mounted]);

  const completeStep = (n: number) => setGuide((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));

  /* ---------- demo sequence handlers ---------- */

  function handleOpenSample(opp: OpportunityInput) {
    setOpportunity(opp);
    setRequirements(null);
    setResults(null);
    setChecklist(null);
    setChangeNote(null);
    setExtractNotice(null);
    setError(null);
    completeStep(4);
  }

  function handleAddManual(opp: OpportunityInput) {
    handleOpenSample(opp);
    handleExtract(opp.description, opp);
  }

  function handleExtract(descriptionOverride?: string, oppOverride?: OpportunityInput) {
    const opp = oppOverride ?? opportunity;
    if (!opp) return;
    const description = descriptionOverride ?? opp.description;
    try {
      const reqs = extractRequirements(opp.title, description);
      setRequirements(reqs);
      setResults(null);
      setChecklist(null);
      setChangeNote(null);
      setExtractNotice(
        `${reqs.length} requirement(s) extracted and schema-validated from “${opp.title}”. Review them below.`
      );
      if (reqs.length === 0) {
        setError('No recognizable requirements were found. Check the description formatting, or add requirements manually below.');
      } else {
        setError(null);
      }
      completeStep(5);
    } catch (e) {
      setError(`Extraction failed validation: ${(e as Error).message}`);
    }
  }

  function handleRemoveRequirement(id: string) {
    setRequirements((prev) => (prev ?? []).filter((r) => r.id !== id));
  }

  function handleAddManualRequirement(r: Requirement) {
    setRequirements((prev) => [...(prev ?? []), r]);
  }

  function handleRunAnalysis() {
    if (!requirements || requirements.length === 0) return;
    setAnalysing(true);
    // Small delay so the loading state is perceptible; all analysis
    // happens locally in the browser.
    window.setTimeout(() => {
      const evals = requirements.map((r) => evaluateRequirement(r, profile));
      setResults(evals);
      setChangeNote(null);
      setAnalysing(false);
      completeStep(6);
      if (containsAllStatuses(evals)) completeStep(7);
    }, 450);
  }

  function handleGenerateChecklist() {
    if (!results) return;
    setChecklist(buildChecklist(results));
    completeStep(9);
  }

  function handleToggleChecklist(id: string) {
    setChecklist((prev) => (prev ?? []).map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
    completeStep(10);
  }

  function handleSaveProfile(updated: StudentProfile) {
    const hadResults = !!results && results.length > 0;
    setProfile(updated);
    setProfileRevision((r) => r + 1);
    completeStep(3);
    if (hadResults && requirements) {
      const rerun = requirements.map((r) => evaluateRequirement(r, updated));
      const changes = results!.filter((r, i) => r.status !== rerun[i].status).length;
      setResults(rerun);
      setChecklist((prev) => {
        if (!prev) return prev;
        const fresh = buildChecklist(rerun);
        const doneIds = new Set(prev.filter((i) => i.done).map((i) => i.requirementId));
        return fresh.map((i) => (doneIds.has(i.requirementId) ? { ...i, done: true } : i));
      });
      setChangeNote(
        changes === 0
          ? 'Analysis re-run — no requirement changed status.'
          : `Analysis re-run — ${changes} requirement(s) changed status after the profile update.`
      );
      completeStep(11);
      if (containsAllStatuses(rerun)) completeStep(7);
    }
  }

  function handleOpenRequirement(er: EvaluatedRequirement) {
    setModalReq(er);
    completeStep(8);
  }

  function handleReset() {
    clearAll();
    setProfile(DEFAULT_PROFILE);
    setOpportunity(SAMPLE_OPPORTUNITIES[0]);
    setRequirements(null);
    setResults(null);
    setChecklist(null);
    setGuide(new Set());
    setChangeNote(null);
    setError(null);
    setExtractNotice(null);
    setModalReq(null);
    setProfileRevision((r) => r + 1);
  }

  /* ---------- derived state ---------- */

  const checklistItemFor = modalReq ? checklist?.find((i) => i.requirementId === modalReq.id) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            <a href="/" className="hover:underline">← Back to landing page</a>
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Interactive Demo</h1>
          <p className="mt-1 text-sm text-slate-600">
            No registration. Everything runs in your browser with fictional sample data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">DEMO MODE</span>
          <button
            onClick={handleReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Reset demo
          </button>
        </div>
      </div>

      <div className="mt-6">
        <GuidePanel done={guide} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* left column */}
        <div className="grid gap-6 lg:col-span-5">
          <ProfilePanel profile={profile} revision={profileRevision} onSave={handleSaveProfile} />
          <OpportunityPanel
            opportunity={opportunity}
            samples={SAMPLE_OPPORTUNITIES}
            onOpenSample={handleOpenSample}
            onAddManual={handleAddManual}
          />
        </div>

        {/* right column */}
        <div className="grid gap-6 lg:col-span-7">
          {error && (
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
              <strong>Heads up:</strong> {error}
            </div>
          )}

          <section aria-label="Analysis actions" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Analysis</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleExtract()}
                disabled={!opportunity}
                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                1 · Extract requirements
              </button>
              <button
                onClick={handleRunAnalysis}
                disabled={!requirements || requirements.length === 0 || analysing}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                2 · Run eligibility analysis
              </button>
              <button
                onClick={handleGenerateChecklist}
                disabled={!results}
                className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                3 · Generate preparation checklist
              </button>
            </div>
            {analysing && (
              <p className="mt-3 text-sm text-slate-600" role="status">
                <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent align-middle" aria-hidden="true" />
                Analyzing locally in your browser — no data leaves this device…
              </p>
            )}
            {extractNotice && !analysing && (
              <p className="mt-3 text-sm text-slate-600" role="status">{extractNotice}</p>
            )}
            {changeNote && (
              <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800" role="status">{changeNote}</p>
            )}
          </section>

          {results && <SummaryBar results={results} />}

          <section aria-label="Requirements and results" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Requirements & results
            </h2>
            {!requirements ? (
              <div className="mt-4">
                <EmptyState
                  title="Nothing to analyze yet"
                  body="Extract requirements from the loaded opportunity (or add one manually), then run the analysis to see MATCH, MISMATCH and MISSING INFORMATION results."
                />
              </div>
            ) : results ? (
              <ul className="mt-4 grid gap-3">
                {results.map((er) => (
                  <RequirementCard key={er.id} requirement={er} evaluated={er} onWhy={handleOpenRequirement} />
                ))}
              </ul>
            ) : (
              <ul className="mt-4 grid gap-3">
                {requirements.map((r) => (
                  <RequirementCard key={r.id} requirement={r} onRemove={handleRemoveRequirement} />
                ))}
              </ul>
            )}
            {requirements && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <RequirementsPanel
                  requirements={requirements}
                  onExtract={() => handleExtract()}
                  onAddManual={handleAddManualRequirement}
                />
              </div>
            )}
          </section>

          <section aria-label="Preparation checklist">
            {!checklist ? (
              <EmptyState
                title="Preparation checklist not generated yet"
                body="Run the analysis first. Every MISMATCH becomes an “improve” item and every MISSING INFORMATION becomes a “confirm” item — unknown never means rejected."
                action={
                  <button
                    onClick={handleGenerateChecklist}
                    disabled={!results}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    Generate preparation checklist
                  </button>
                }
              />
            ) : (
              <ChecklistPanel items={checklist} onToggle={handleToggleChecklist} />
            )}
          </section>
        </div>
      </div>

      {modalReq && (
        <RequirementModal evaluated={modalReq} checklistItem={checklistItemFor} onClose={() => setModalReq(null)} />
      )}
    </div>
  );
}
