import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-midnight-700/60 bg-midnight-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-cream-50">
              Opportunity<span className="text-teal-400">Kit</span>
            </p>
            <p className="mt-1 max-w-xs text-sm text-cream-100/60">
              Clarity for every opportunity — structured requirements, explained eligibility,
              and a plan you can follow.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/demo" className="text-cream-100/70 hover:text-teal-300">Interactive Demo</Link>
            <a href="#problem" className="text-cream-100/70 hover:text-teal-300">Problem</a>
            <a href="#clarity" className="text-cream-100/70 hover:text-teal-300">Solution</a>
            <a href="#statuses" className="text-cream-100/70 hover:text-teal-300">The Difference</a>
            <a href="#preview" className="text-cream-100/70 hover:text-teal-300">Preview</a>
            <Link href="/technology" className="text-cream-100/70 hover:text-teal-300">Technology</Link>
            <Link href="/business-model" className="text-cream-100/70 hover:text-teal-300">Business Model</Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-midnight-700/60 pt-6 text-xs text-cream-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>SETU 2026 · Forge Realm | PS-03</p>
          <p>Team Believer · Tanvi Goyal</p>
          <p>All characters and opportunities shown are fictional demo data.</p>
        </div>
      </div>
    </footer>
  );
}
