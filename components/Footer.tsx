import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            <strong className="text-slate-900">OpportunityKit</strong> — SETU 2026 prototype. All students, companies and opportunities
            shown are fictional demo data.
          </p>
          <p className="text-sm text-slate-500">
            Built with Next.js · React · TypeScript · Tailwind CSS ·{' '}
            <Link href="/demo" className="font-medium text-indigo-600 hover:underline">
              Reset & relaunch the demo
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
