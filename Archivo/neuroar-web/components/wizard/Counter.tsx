'use client';

import { animate, useMotionValue, useTransform, motion } from 'framer-motion';
import { useEffect } from 'react';

export function Counter({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [to, duration, mv]);
  return <motion.span>{rounded}</motion.span>;
}
