import Link from 'next/link';

export const metadata = {
  title: 'Business Model — OpportunityKit',
};

/**
 * Business-model information for the SETU 2026 submission.
 * Moved off the landing page during the redesign; the
 * information remains available here for judges.
 */
export default function BusinessModelPage() {
  return (
    <main className="bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
          <Link href="/" className="hover:underline">← Home</Link>
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-midnight-900 sm:text-4xl">
          Business model
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A plausible proposed model. A free tier encourages adoption among students; premium
          tools and institutional licensing could support sustainability.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-midnight-900">Free student tier</h2>
            <p className="mt-1 text-sm text-slate-500">For adoption and word-of-mouth</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>Basic profile</li>
              <li>Limited opportunity analyses per month</li>
              <li>Preparation checklists</li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-teal-500/40 bg-teal-50/40 p-5 shadow-sm">
            <h2 className="font-semibold text-midnight-900">
              Student premium <span className="text-xs font-normal text-slate-500">(proposed)</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">Illustrative: ₹199/month · ₹999/year</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>More analyses, saved history</li>
              <li>Advanced preparation tools</li>
              <li>Priority support</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-midnight-900">
              College / career-cell licensing <span className="text-xs font-normal text-slate-500">(proposed)</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">Illustrative: ₹25,000–₹1,00,000 / institution / year</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>Opportunity discovery for students</li>
              <li>Preparation support at scale</li>
              <li>Career-cell dashboard</li>
            </ul>
          </div>
        </div>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Pricing is illustrative planning only. OpportunityKit has no customers, revenue,
          partnerships, or measured willingness to pay at this prototype stage.
        </p>
      </div>
    </main>
  );
}
