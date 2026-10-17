'use client';

import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import PrincipleDemo from '@/components/PrincipleDemo';

const JUDGE_CRITERIA: Array<{ criterion: string; where: string }> = [
  { criterion: 'Innovation', where: 'The three-state eligibility engine (MATCH / MISMATCH / MISSING INFORMATION) and the interactive “missing ≠ ineligible” demo below.' },
  { criterion: 'Monetization', where: 'Business Model section — free student tier, premium student tools, institutional licensing (illustrative pricing only).' },
  { criterion: 'UI/UX', where: 'One-click “Start Interactive Demo”, responsive layout, readable status badges, empty / loading / error states, short path to core functionality.' },
  { criterion: 'Completeness', where: 'End-to-end workflow with saved progress, meaningful validation, realistic demo data, automated tests (npm test). Every advertised feature works or is explicitly labeled planned.' },
  { criterion: 'Overall approach', where: 'Technology & Approach section, this document, and SUBMISSION-STATUS.md — problem, user journey, rules, assumptions, limitations, next steps.' },
];

export default function LandingPage() {
  return (
    <>
      {/* hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/80 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-800">
            SETU 2026 · Prototype
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            OpportunityKit — know <span className="text-indigo-600">exactly</span> where you stand for every opportunity
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Opportunity requirements are scattered across posters, PDFs and WhatsApp forwards. OpportunityKit structures
            them into a consistent format, compares them with a student&apos;s profile, and explains every result as
            <strong> MATCH</strong>, <strong> MISMATCH</strong>, or <strong>MISSING INFORMATION</strong> — then turns gaps
            and unknowns into a preparation checklist.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Interactive Demo
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              How it works
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No sign-up · Sample data included · Runs entirely in your browser · Demo reset available
          </p>
        </div>
      </section>

      {/* problem */}
      <section id="problem" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">The problem</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Scattered requirements', body: 'Opportunity requirements live in posters, PDFs, emails and chat groups — every source uses a different format, and comparing them manually is slow and error-prone.' },
            { title: '“Do I even qualify?”', body: 'Students struggle to determine whether they meet the criteria. Many self-reject out of caution, while others apply blindly and waste effort.' },
            { title: 'Unknowns feel like rejection', body: 'Missing skills, unuploaded documents and unconfirmed information create uncertainty — and uncertainty feels the same as ineligibility.' },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* solution */}
      <section id="solution" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">The solution</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '1', title: 'Structure requirements', body: 'Opportunity descriptions are parsed into a consistent, validated format — degree, CGPA, skills, availability, documents and more.' },
              { n: '2', title: 'Compare with the profile', body: 'Each structured requirement is compared against the student&apos;s profile using explicit, testable rules.' },
              { n: '3', title: 'Explain with three states', body: 'Every result is MATCH, MISMATCH, or MISSING INFORMATION — each with a plain-language explanation of exactly why.' },
              { n: '4', title: 'Act on gaps & unknowns', body: 'Gaps and unknowns become an actionable preparation checklist. Confirming information re-runs the analysis instantly.' },
            ].map((s) => (
              <li key={s.n} className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white" aria-hidden="true">{s.n}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* distinguishing principle */}
      <section id="principle" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">The distinguishing principle</h2>
        <p className="mt-2 text-lg font-medium text-indigo-700">“Missing information is not the same as ineligibility.”</p>
        <p className="mt-2 max-w-3xl text-slate-600">
          Most tools treat an unanswered question as a rejection. OpportunityKit keeps <em>unknown</em> visibly distinct
          from <em>confirmed no</em>. Try it — this widget runs the real eligibility engine:
        </p>
        <div className="mt-6">
          <PrincipleDemo />
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">How it works</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Five steps, fully working in the interactive demo — reachable in one click from the
            <a href="/demo" className="font-medium text-indigo-600 hover:underline"> Start Interactive Demo </a> button.
          </p>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {[
              { n: '1', t: 'Load a profile', d: 'A fictional student profile loads instantly — no registration.' },
              { n: '2', t: 'Open an opportunity', d: 'Pick a labeled sample internship or paste any description manually.' },
              { n: '3', t: 'Extract requirements', d: 'The parser structures the description into validated requirements.' },
              { n: '4', t: 'Run the analysis', d: 'The rules engine compares requirements with the profile and explains each result.' },
              { n: '5', t: 'Prepare', d: 'A checklist turns every gap and unknown into a concrete next step.' },
            ].map((s) => (
              <li key={s.n} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden="true">{s.n}</span>
                <h3 className="mt-2 font-semibold text-slate-900">{s.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* technology & approach */}
      <section id="technology" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Technology & approach</h2>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Pipeline</h3>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <ArchitectureDiagram />
        </div>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Stack</h3>
        <dl className="mt-3 grid gap-4 md:grid-cols-2">
          {[
            ['Frontend', 'Next.js (App Router), React, TypeScript, Tailwind CSS — implemented.'],
            ['Requirement extraction', 'Validated parsing of opportunity descriptions (deterministic rules + zod schema validation). Optional server-side LLM integration is PLANNED — the /api/extract endpoint currently runs the same validated parser and reports llmConfigured: false.'],
            ['Eligibility engine', 'Explicit, unit-tested rules (RULE-DEGREE-01 … RULE-OTHER-01) that assign MATCH, MISMATCH or MISSING INFORMATION with explanations.'],
            ['Persistence', 'Local demo storage (localStorage) — implemented. Supabase PostgreSQL is an OPTIONAL integration, not configured in this prototype.'],
            ['Validation', 'Typed schemas (zod), form input validation, and automated tests (vitest) covering extraction, the rules engine, checklist generation and the full demo sequence.'],
            ['Deployment', 'Pending at submission time — one-command deploy to Vercel or Netlify; instructions in README.md.'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="font-semibold text-slate-900">{k}</dt>
              <dd className="mt-1 text-sm text-slate-600">{v}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Honest status of every layer</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <h4 className="font-semibold text-emerald-900">Implemented now</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-emerald-900/80">
              <li>Landing page + guided demo (no signup)</li>
              <li>Deterministic requirement extraction with schema validation</li>
              <li>Three-state eligibility rules engine with explanations</li>
              <li>Requirement detail view (“why this status?”)</li>
              <li>Preparation checklist with saved progress</li>
              <li>Profile editing with automatic re-analysis and change highlighting</li>
              <li>Automated tests (npm test)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <h4 className="font-semibold text-amber-900">Optional integrations — NOT configured</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900/80">
              <li>Server-side LLM extraction (endpoint shape ready; deterministic parser used until an API key is configured)</li>
              <li>Supabase PostgreSQL persistence (demo uses localStorage only)</li>
            </ul>
            <p className="mt-2 text-xs text-amber-800">None of these are described as operational anywhere in the prototype.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <h4 className="font-semibold text-slate-900">Future improvements</h4>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
              <li>LLM-assisted extraction with source-sentence citations</li>
              <li>Accounts, saved history and multi-opportunity comparison</li>
              <li>Institutional dashboards for career cells</li>
              <li>Accessibility audit and localization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* business model */}
      <section id="business-model" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Business model</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            A plausible proposed model. A free tier encourages adoption among students; premium tools and institutional
            licensing could support sustainability.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Free student tier</h3>
              <p className="mt-1 text-sm text-slate-500">For adoption and word-of-mouth</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                <li>Basic profile</li>
                <li>Limited opportunity analyses per month</li>
                <li>Preparation checklists</li>
              </ul>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Student premium <span className="text-xs font-normal text-slate-500">(proposed)</span></h3>
              <p className="mt-1 text-sm text-slate-500">Illustrative: ₹199/month · ₹999/year</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                <li>More analyses, saved history</li>
                <li>Advanced preparation tools</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">College / career-cell licensing <span className="text-xs font-normal text-slate-500">(proposed)</span></h3>
              <p className="mt-1 text-sm text-slate-500">Illustrative: ₹25,000–₹1,00,000 / institution / year</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                <li>Opportunity discovery for students</li>
                <li>Preparation support at scale</li>
                <li>Career-cell dashboard</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Pricing is illustrative planning only. OpportunityKit has no customers, revenue, partnerships, or measured
            willingness to pay at this prototype stage.
          </p>
        </div>
      </section>

      {/* for judges */}
      <section id="judges" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">For judges — where to look</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-900">Evaluation criterion</th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-900">Where to evaluate it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {JUDGE_CRITERIA.map((row) => (
                <tr key={row.criterion}>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.criterion}</td>
                  <td className="px-4 py-3 text-slate-600">{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Start Interactive Demo
            <span aria-hidden="true">→</span>
          </a>
          <span className="text-sm text-slate-500">~3 minutes · no registration · resettable</span>
        </div>
      </section>
    </>
  );
}
