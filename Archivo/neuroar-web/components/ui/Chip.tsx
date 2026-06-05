import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono tracking-tight',
        'border border-line bg-white/[0.03] text-ink-dim',
        className,
      )}
      {...props}
    />
  );
}
