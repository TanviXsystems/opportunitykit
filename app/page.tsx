'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import HeroScene from '@/components/hero/HeroScene';
import ProblemCards from '@/components/ProblemCards';
import ClaritySteps from '@/components/ClaritySteps';
import StatusCards from '@/components/StatusCards';
import ProductPreview from '@/components/ProductPreview';
import SectionReveal from '@/components/SectionReveal';

export default function LandingPage() {
  return (
    <>
      {/* ——— Section 1: immersive hero ——— */}
      <section className="relative overflow-hidden bg-midnight-900">
        {/* cinematic glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-coral-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:grid lg:grid-cols-[1.05fr_1.35fr] lg:items-center lg:pb-24 lg:pt-28">
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
              SETU 2026 · Prototype
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
              Opportunities are everywhere. <span className="text-teal-400">Clarity isn&apos;t.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream-100/80">
              Turn confusing internship, scholarship, and competition requirements into clear
              eligibility results and a plan you can actually follow.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-coral-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-coral-500/30 transition-colors hover:bg-coral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
              >
                Try the Interactive Demo
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#clarity"
                className="inline-flex items-center gap-2 rounded-xl border border-cream-100/30 px-6 py-3.5 text-base font-semibold text-cream-100 transition-colors hover:border-cream-100/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-cream-100/60">
              Know what matches. Discover what&apos;s missing. Plan your next step.
            </p>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* ——— Section 2: the problem ——— */}
      <section id="problem" className="scroll-mt-20 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">The problem</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
              The application process shouldn&apos;t be a guessing game
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <ProblemCards />
          </SectionReveal>
        </div>
      </section>

      {/* ——— Section 3: the solution ——— */}
      <section id="clarity" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">The solution</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
              Meet your clarity layer
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              OpportunityKit sits between the employer&apos;s wall of criteria and the student&apos;s
              pile of documents — and turns both into one clear picture.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <ClaritySteps />
          </SectionReveal>
        </div>
      </section>

      {/* ——— Section 4: the differentiator ——— */}
      <section id="statuses" className="scroll-mt-20 bg-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">The difference</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
              Not a match? Not enough information? There&apos;s a difference.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Most tools treat every unknown as a rejection. OpportunityKit keeps
              <strong> unknown</strong> visibly distinct from <strong>confirmed no</strong> — so
              students know exactly what to confirm next. Tap a status to see a real example from
              the engine. OpportunityKit clarifies eligibility; it never guarantees selection.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <StatusCards />
          </SectionReveal>
        </div>
      </section>

      {/* ——— Section 5: working product preview ——— */}
      <section id="preview" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Working product preview</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
              Try the real engine, right here
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              A fictional student profile on one side, a real sample opportunity on the other.
              Update the information and watch the results change — instantly.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <ProductPreview />
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl bg-coral-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-coral-500/30 transition-colors hover:bg-coral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
              >
                Try the Interactive Demo
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ——— Section 6: closing CTA ——— */}
      <section className="relative overflow-hidden bg-midnight-900">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <SectionReveal>
            <h2 className="text-4xl font-black tracking-tight text-cream-50 sm:text-5xl">
              Stop guessing. Start preparing.
            </h2>
            <p className="mt-4 text-lg text-cream-100/75">
              Your next opportunity deserves more than a confusing checklist.
            </p>
            <Link
              href="/demo"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-8 py-4 text-lg font-bold text-midnight-950 shadow-lg shadow-teal-400/25 transition-colors hover:bg-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              Explore OpportunityKit
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-4 text-sm text-cream-100/50">
              Free to try · No registration · All sample data is fictional
            </p>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
