'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost';
}

export function MagneticCTA({ href, children, className, variant = 'primary' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * 0.25);
    y.set(my * 0.35);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const styles =
    variant === 'primary'
      ? 'bg-cyan text-bg ring-glow font-medium'
      : 'glass text-ink border border-line-strong hover:border-cyan/40';

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={cn(
        'inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-base transition-colors',
        styles,
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
