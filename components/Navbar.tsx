'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#clarity', label: 'Solution' },
  { href: '#statuses', label: 'The Difference' },
  { href: '#preview', label: 'Preview' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-midnight-700/60 bg-midnight-900/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-midnight-950" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M12 12v3" />
              <path d="M9 17a3 3 0 0 1 6 0" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-cream-50">
            Opportunity<span className="text-teal-400">Kit</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-cream-100/80 hover:bg-white/10 hover:text-cream-50"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-coral-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-coral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
          >
            Start Interactive Demo
            <span aria-hidden="true">→</span>
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-cream-100 hover:bg-white/10 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-midnight-700 bg-midnight-900 px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-cream-100/80 hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
          <Link href="/demo" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-bold text-coral-400 hover:bg-white/10">
            Start Interactive Demo →
          </Link>
        </div>
      )}
    </header>
  );
}
