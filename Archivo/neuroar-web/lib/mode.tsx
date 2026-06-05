'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Mode = 'family' | 'professional';

interface ModeCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  ready: boolean;
}

const Ctx = createContext<ModeCtx | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('family');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('neuroar:mode') : null;
    if (stored === 'family' || stored === 'professional') setModeState(stored);
    setReady(true);
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    if (typeof window !== 'undefined') localStorage.setItem('neuroar:mode', m);
  };

  return <Ctx.Provider value={{ mode, setMode, ready }}>{children}</Ctx.Provider>;
}

export function useMode() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMode outside ModeProvider');
  return v;
}
