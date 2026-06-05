'use client';

import { motion } from 'framer-motion';
import type { DomainResult, Report } from '@/lib/reports';
import { rangeColor, rangeLabel } from '@/lib/reports';
import { DOMAIN_META } from '@/lib/domains';
import { useMode } from '@/lib/mode';
import { Counter } from './Counter';
import { PercentileCurve } from './PercentileCurve';
import { QuickReplies } from './QuickReplies';
import { quickRepliesFor } from './quickRepliesByDomain';
import { askChat } from '@/lib/chatBus';
import { Quote } from 'lucide-react';

interface Props {
  report: Report;
  domain: DomainResult;
}

export function DomainStep({ report, domain }: Props) {
  const { mode } = useMode();
  const meta = DOMAIN_META[domain.key];
  const color = rangeColor(domain.range);
  const quickReplies = quickRepliesFor(domain, mode);
  const description = mode === 'family' ? meta.familyDescription : meta.description;

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-widest text-ink-faint mb-3"
        >
          Dominio cognitivo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="display text-5xl md:text-7xl tracking-tightest"
        >
          {domain.label}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-ink-dim max-w-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-end gap-6"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1">
              Percentil
            </div>
            <div className="display text-[8rem] leading-none" style={{ color }}>
              <Counter to={domain.percentile} />
            </div>
          </div>
          <div className="pb-6">
            <span
              className="inline-flex items-center px-3 h-8 rounded-full text-xs font-medium border"
              style={{ color, borderColor: `${color}55`, background: `${color}15` }}
            >
              ● {rangeLabel(domain.range)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <PercentileCurve percentile={domain.percentile} range={domain.range} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 glass p-5"
        >
          <div className="flex items-start gap-3">
            <Quote className="w-4 h-4 text-cyan mt-1 shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-1">
                Evidencia del informe
              </p>
              <p className="text-ink-dim italic">"{domain.evidence}"</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass p-6 sticky top-28"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">
          Interpretación clínica
        </p>
        <p className="text-ink leading-relaxed">{domain.interpretation}</p>

        <div className="mt-6 pt-5 border-t border-line">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">
            Profundiza con el asistente
          </p>
          <QuickReplies items={quickReplies} onPick={(t) => askChat(t)} />
        </div>
      </motion.div>
    </div>
  );
}
