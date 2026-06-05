'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  items: string[];
  onPick: (text: string) => void;
}

export function QuickReplies({ items, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <motion.button
          key={t}
          onClick={() => onPick(t)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className={cn(
            'text-sm px-3.5 h-9 rounded-full border border-line bg-white/[0.03]',
            'hover:border-cyan/40 hover:bg-cyan/[0.08] hover:text-cyan',
            'text-ink-dim transition-colors',
          )}
        >
          {t}
        </motion.button>
      ))}
    </div>
  );
}
