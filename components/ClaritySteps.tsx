'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * "Meet your clarity layer" — the three-step solution, shown as
 * a small animated transformation rather than three plain cards.
 */
export default function ClaritySteps() {
  const reduced = useReducedMotion();

  return (
    <div className="mt-10">
      {/* transformation strip: scattered papers → structured cards → checklist */}
      <div className="mb-8 flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:gap-6" aria-hidden="true">
        {/* messy papers */}
        <div className="relative h-20 w-24 shrink-0">
          {reduced ? null : (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-10 w-8 rounded-[3px] border border-slate-200 bg-cream-100 shadow-sm"
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                  whileInView={{ x: (i % 2) * 10 - 4, y: i * 3 - 5, rotate: [0, -14, 10, -6][i], opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                />
              ))}
            </>
          )}
        </div>

        <motion.svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          className="shrink-0 text-teal-600"
          initial={false}
          whileInView={{ opacity: [0.2, 1] }}
          viewport={{ once: true }}
          transition={{ repeat: reduced ? 0 : Infinity, duration: 1.6, repeatDelay: 0.4 }}
        >
          <path d="M2 12h38m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        {/* structured cards */}
        <div className="grid h-20 w-24 shrink-0 grid-cols-2 gap-1.5">
          {['#14b8a6', '#f59e0b', '#ff6b5e', '#14b8a6'].map((c, i) => (
            <motion.div
              key={c}
              className="rounded-md shadow-sm"
              style={{ backgroundColor: c }}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            />
          ))}
        </div>

        <motion.svg
          width="48"
          height="24"
          viewBox="0 0 48 24"
          className="shrink-0 text-teal-600"
          initial={false}
          whileInView={{ opacity: [0.2, 1] }}
          viewport={{ once: true }}
          transition={{ repeat: reduced ? 0 : Infinity, duration: 1.6, repeatDelay: 0.4 }}
        >
          <path d="M2 12h38m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        {/* checklist */}
        <div className="h-20 w-24 shrink-0 space-y-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-cream-50 px-2 py-1 shadow-sm"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
            >
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-teal-500 text-[8px] font-bold text-white">
                ✓
              </span>
              <span className="h-1.5 w-12 rounded-full bg-slate-200" />
            </motion.div>
          ))}
        </div>
      </div>

      <ol className="grid gap-5 md:grid-cols-3">
        {[
          {
            n: '1',
            title: 'Understand the opportunity',
            body: 'OpportunityKit structures scattered eligibility requirements into one consistent, validated format — no more decoding five different posting styles.',
          },
          {
            n: '2',
            title: 'Check your fit',
            body: 'Each requirement is compared against your profile with explicit, testable rules — and every result comes with a plain-language explanation.',
          },
          {
            n: '3',
            title: 'Know your next move',
            body: 'Gaps become “improve” items and unknowns become “confirm” items in a personalized preparation checklist you can act on today.',
          },
        ].map((s, i) => (
          <motion.li
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-midnight-900 text-sm font-bold text-teal-300">
              {s.n}
            </span>
            <h3 className="mt-2 text-lg font-bold text-midnight-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
