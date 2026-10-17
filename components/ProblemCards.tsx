'use client';

import { motion, useReducedMotion } from 'framer-motion';

const CARDS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 5h16M4 12h10M4 19h13" />
        <circle cx="18" cy="12" r="2.2" />
      </svg>
    ),
    title: 'Too many requirements, too many places',
    body: 'Criteria hide in posters, PDFs, emails and chat groups — every source uses a different format, and comparing them by hand is slow and error-prone.',
    accent: 'bg-coral-500',
    float: { rotate: [0, 4, 0], y: [0, -6, 0] },
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
        <path d="M8.5 11h5" />
      </svg>
    ),
    title: 'Unsure which criteria you actually meet',
    body: 'Students struggle to tell whether they qualify. Many self-reject out of caution; others apply blindly and waste effort on long shots.',
    accent: 'bg-teal-500',
    float: { rotate: [0, -4, 0], y: [0, -8, 0] },
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
    title: 'Unsure what to fix or confirm first',
    body: 'Missing skills, unuploaded documents and unconfirmed details all feel like rejection — so students either give up or apply hoping for the best.',
    accent: 'bg-amber-400',
    float: { rotate: [0, 5, 0], y: [0, -5, 0] },
  },
];

export default function ProblemCards() {
  const reduced = useReducedMotion();
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {CARDS.map((c, i) => (
        <motion.article
          key={c.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <motion.div
            className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.accent}`}
            animate={reduced ? undefined : c.float}
            transition={reduced ? undefined : { repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            {c.icon}
          </motion.div>
          <h3 className="text-lg font-bold text-midnight-900">{c.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
          <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cream-100 opacity-60 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
        </motion.article>
      ))}
    </div>
  );
}
