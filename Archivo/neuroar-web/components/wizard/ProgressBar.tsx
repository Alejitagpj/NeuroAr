'use client';

import { motion } from 'framer-motion';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-cyan"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="font-mono text-[11px] text-ink-faint mt-1.5 tracking-wide">
        {current + 1} / {total}
      </p>
    </div>
  );
}
