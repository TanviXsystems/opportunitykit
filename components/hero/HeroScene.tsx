'use client';

/**
 * Hero scene wrapper.
 *
 * - Lazy-loads the real 3D scene (React Three Fiber).
 * - Falls back to a polished 2D SVG scene when WebGL is
 *   unavailable, when the canvas throws, or when the visitor
 *   prefers reduced motion.
 * - Scroll-linked three-stage storytelling (confusion →
 *   bridge → clarity), pointer parallax on fine pointers only.
 * - The "Organize these requirements" payoff renders a panel
 *   computed by the REAL eligibility engine (see OrganizePanel).
 */
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import HeroFallback from './HeroFallback';
import OrganizePanel from './OrganizePanel';

const HeroCanvas = dynamic(() => import('./Scene3D').then((m) => m.HeroCanvas), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? <HeroFallback /> : this.props.children;
  }
}

const STAGE_LABELS = ['Confusion', 'The bridge', 'Clarity'];

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [stage, setStage] = useState(0);
  const [organized, setOrganized] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [dense, setDense] = useState(true);
  const organizedRef = useRef(false);

  useEffect(() => {
    setWebgl(webglAvailable());
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setDense(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (organizedRef.current || reduced) return;
    const next = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    setStage((prev) => (prev === next ? prev : next));
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !e.pointerType || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - r.left) / Math.max(r.width, 1) - 0.5,
      y: (e.clientY - r.top) / Math.max(r.height, 1) - 0.5,
    });
  };

  const handleOrganize = () => {
    setOrganized(true);
    organizedRef.current = true;
    setStage(2);
  };

  const scene = useMemo(() => {
    if (!webgl || reduced) return <HeroFallback />;
    return (
      <SceneErrorBoundary onFailure={() => setWebgl(false)}>
        <HeroCanvas stage={stage} pointer={pointer} dense={dense} />
      </SceneErrorBoundary>
    );
  }, [webgl, reduced, stage, pointer, dense]);

  return (
    <div>
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative h-[54vh] min-h-[380px] overflow-hidden rounded-3xl border border-midnight-700/60 bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-950 shadow-2xl sm:h-[62vh]"
      >
        {scene}

        {/* dialogue bubbles — illustrative, fictional characters */}
        <div className="pointer-events-none absolute left-[4%] top-[10%] hidden max-w-[240px] rounded-2xl rounded-bl-sm bg-cream-50 px-4 py-2.5 text-sm font-medium text-midnight-900 shadow-lg sm:block">
          “Must have 3 years of experience. Entry-level role.”
          <span className="mt-1 block text-[10px] font-normal uppercase tracking-wide text-slate-500">
            The hiring manager — fictional
          </span>
        </div>
        <div className="pointer-events-none absolute right-[3%] top-[38%] hidden max-w-[240px] rounded-2xl rounded-br-sm bg-cream-50 px-4 py-2.5 text-sm font-medium text-midnight-900 shadow-lg sm:block">
          “I have the skills… but which 17 documents do you want?”
          <span className="mt-1 block text-[10px] font-normal uppercase tracking-wide text-slate-500">
            The student — fictional
          </span>
        </div>

        {/* stage indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2" aria-hidden="true">
          {STAGE_LABELS.map((label, i) => (
            <span
              key={label}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                stage === i ? 'bg-teal-400 text-midnight-950' : 'bg-white/10 text-cream-100/70'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <p className="absolute bottom-4 right-4 text-[10px] uppercase tracking-wide text-cream-100/50">
          Illustrative 3D scene · fictional characters
        </p>

        {/* interaction payoff */}
        <div className="absolute inset-x-0 bottom-14 flex justify-center">
          <button
            onClick={handleOrganize}
            disabled={organized}
            className="rounded-full bg-coral-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-coral-500/30 transition-all hover:bg-coral-400 hover:shadow-coral-400/40 disabled:cursor-default disabled:bg-teal-400 disabled:text-midnight-950 disabled:shadow-teal-400/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
          >
            {organized ? '✓ Requirements organized' : '✦ Organize these requirements'}
          </button>
        </div>
      </div>

      <AnimatePresence>{organized && <OrganizePanel />}</AnimatePresence>
    </div>
  );
}
