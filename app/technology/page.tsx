import Link from 'next/link';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';

export const metadata = {
  title: 'Technology & Approach — OpportunityKit',
};

/**
 * Technical documentation for the SETU 2026 submission.
 * Moved off the landing page during the redesign so the story
 * stays cinematic — the information remains fully available here.
 */
export default function TechnologyPage() {
  return (
    <main className="bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
          <Link href="/" className="hover:underline">← Home</Link>
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
          Technology &amp; approach
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          The actual architecture of the OpportunityKit prototype — what is implemented now,
          what is an optional integration, and what is planned.
        </p>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">Pipeline</h2>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <ArchitectureDiagram />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Student Profile + Opportunity Description → Requirement Extraction → Validated Structured
          Requirements → Eligibility Rules Engine → Explained Results → Preparation Checklist.
        </p>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">Stack</h2>
        <dl className="mt-3 grid gap-4 md:grid-cols-2">
          {[
            ['Frontend', 'Next.js (App Router), React, TypeScript, Tailwind CSS — implemented.'],
            ['Requirement extraction', 'Validated parsing of opportunity descriptions (deterministic rules + zod schema validation). Optional server-side LLM integration is PLANNED — the /api/extract endpoint currently runs the same validated parser and reports llmConfigured: false.'],
            ['Eligibility engine', 'Explicit, unit-tested rules (RULE-DEGREE-01 … RULE-OTHER-01) that assign MATCH, MISMATCH or MISSING INFORMATION with explanations.'],
            ['Persistence', 'Local demo storage (localStorage) — implemented. Supabase PostgreSQL is an OPTIONAL integration, not configured in this prototype.'],
            ['Validation', 'Typed schemas (zod), input validation, and automated tests (vitest) covering extraction, the rules engine, checklist generation and the full demo sequence.'],
            ['Deployment', 'Pending at submission time — one-command deploy to Vercel or Netlify; instructions in README.md.'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="font-semibold text-midnight-900">{k}</dt>
              <dd className="mt-1 text-sm text-slate-600">{v}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Honest status of every layer
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <h3 className="font-semibold text-emerald-900">Implemented now</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-emerald-900/80">
              <li>Landing experience + guided demo (no signup)</li>
              <li>Deterministic requirement extraction with schema validation</li>
              <li>Three-state eligibility rules engine with explanations</li>
              <li>Requirement detail view (“why this status?”)</li>
              <li>Preparation checklist with saved progress</li>
              <li>Profile editing with automatic re-analysis and change highlighting</li>
              <li>Automated tests (npm test)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <h3 className="font-semibold text-amber-900">Optional integrations — NOT configured</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/80">
              <li>Server-side LLM extraction (endpoint shape ready; deterministic parser used until an API key is configured)</li>
              <li>Supabase PostgreSQL persistence (demo uses localStorage only)</li>
            </ul>
            <p className="mt-2 text-xs text-amber-800">None of these are described as operational anywhere in the prototype.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="font-semibold text-slate-900">Future improvements</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
              <li>LLM-assisted extraction with source-sentence citations</li>
              <li>Accounts, saved history and multi-opportunity comparison</li>
              <li>Institutional dashboards for career cells</li>
              <li>Accessibility audit and localization</li>
            </ul>
          </div>
        </div>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Evaluation criteria map
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-cream-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-midnight-900">Criterion</th>
                <th scope="col" className="px-4 py-3 font-semibold text-midnight-900">Where to evaluate it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ['Innovation', 'The three-state eligibility engine (MATCH / MISMATCH / MISSING INFORMATION) and the interactive status examples on the landing page.'],
                ['Monetization', 'Business Model page — free student tier, premium student tools, institutional licensing (illustrative pricing only).'],
                ['UI/UX', 'One-click demo, responsive layout, readable status badges, empty / loading / error states, short path to core functionality.'],
                ['Completeness', 'End-to-end workflow with saved progress, meaningful validation, realistic demo data, automated tests (npm test).'],
                ['Overall approach', 'This page, README.md and SUBMISSION-STATUS.md — problem, user journey, rules, assumptions, limitations, next steps.'],
              ].map(([c, w]) => (
                <tr key={c}>
                  <td className="px-4 py-3 font-medium text-midnight-900">{c}</td>
                  <td className="px-4 py-3 text-slate-600">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
