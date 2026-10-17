import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'OpportunityKit — SETU 2026 Prototype',
  description:
    'OpportunityKit structures scattered opportunity requirements, explains eligibility with three states (MATCH, MISMATCH, MISSING INFORMATION), and turns gaps into an actionable preparation checklist.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
