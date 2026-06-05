'use client';

import Link from 'next/link';
import { useMode } from '@/lib/mode';
import { cn } from '@/lib/utils';

export function TopNav() {
  const { mode, setMode } = useMode();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/30 grid place-items-center text-cyan font-mono text-sm">
            N
          </div>
          <span className="font-medium tracking-tight">NeuroAR</span>
        </Link>
        <nav className="flex items-center gap-1.5 p-1 glass rounded-full text-sm">
          <button
            onClick={() => setMode('family')}
            className={cn(
              'px-4 h-9 rounded-full transition-all',
              mode === 'family' ? 'bg-cyan text-bg' : 'text-ink-dim hover:text-ink',
            )}
          >
            Familia
          </button>
          <button
            onClick={() => setMode('professional')}
            className={cn(
              'px-4 h-9 rounded-full transition-all',
              mode === 'professional' ? 'bg-cyan text-bg' : 'text-ink-dim hover:text-ink',
            )}
          >
            Profesional
          </button>
        </nav>
        <Link
          href="/reports"
          className="hidden md:inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-white/[0.04] border border-line hover:border-cyan/40 transition-colors text-sm"
        >
          Entrar →
        </Link>
      </div>
    </header>
  );
}
