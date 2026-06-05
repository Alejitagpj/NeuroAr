'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import type { Report } from '@/lib/reports';
import { useMode } from '@/lib/mode';
import { setActiveReport } from '@/lib/chatBus';
import { ProgressBar } from './ProgressBar';
import { WelcomeStep } from './WelcomeStep';
import { DomainStep } from './DomainStep';
import { SynthesisStep } from './SynthesisStep';

interface Props {
  report: Report;
}

type Step =
  | { kind: 'welcome' }
  | { kind: 'domain'; index: number }
  | { kind: 'synthesis' };

export function WizardShell({ report }: Props) {
  const { mode } = useMode();
  const [current, setCurrent] = useState(0);

  // Adaptive ordering: family → strengths first, low last; professional → low first.
  const orderedDomains = useMemo(() => {
    const order = (r: string) => (r === 'destacado' ? 0 : r === 'esperado' ? 1 : 2);
    const arr = [...report.domains];
    if (mode === 'family') {
      arr.sort((a, b) => order(a.range) - order(b.range));
    } else {
      arr.sort((a, b) => order(b.range) - order(a.range)); // low first
    }
    return arr;
  }, [report.domains, mode]);

  const steps: Step[] = useMemo(
    () => [{ kind: 'welcome' as const }, ...orderedDomains.map((_, i) => ({ kind: 'domain' as const, index: i })), { kind: 'synthesis' as const }],
    [orderedDomains],
  );

  useEffect(() => {
    setActiveReport(report.id);
  }, [report.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(c + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  const step = steps[current];

  return (
    <div className="min-h-screen">
      {/* Top wizard bar */}
      <div className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-bg/70 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center gap-6">
          <Link href="/reports" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink">
            <X className="w-4 h-4" />
            Salir
          </Link>
          <div className="font-mono text-xs text-ink-faint">
            {report.code} · {report.age} años · Modo {mode === 'family' ? 'Familia' : 'Profesional'}
          </div>
          <div className="flex-1 max-w-md ml-auto">
            <ProgressBar current={current} total={steps.length} />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-28 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {step.kind === 'welcome' && <WelcomeStep report={report} />}
            {step.kind === 'domain' && (
              <DomainStep report={report} domain={orderedDomains[step.index]} />
            )}
            {step.kind === 'synthesis' && <SynthesisStep report={report} />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-bg/80 backdrop-blur-xl border-t border-line">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm text-ink-dim hover:text-ink hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          <div className="text-xs text-ink-faint font-mono hidden md:block">
            ← → para navegar
          </div>
          <button
            onClick={() => setCurrent((c) => Math.min(c + 1, steps.length - 1))}
            disabled={current === steps.length - 1}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm bg-cyan text-bg font-medium disabled:opacity-30 disabled:pointer-events-none"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
