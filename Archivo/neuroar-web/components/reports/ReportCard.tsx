'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Report } from '@/lib/reports';
import { MiniRadar } from './MiniRadar';
import { ArrowRight } from 'lucide-react';

export function ReportCard({ report, index }: { report: Report; index: number }) {
  const lowCount = report.domains.filter((d) => d.range === 'bajo').length;
  const highCount = report.domains.filter((d) => d.range === 'destacado').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/reports/${report.id}`}
        className="block glass p-6 group hover:border-cyan/40 hover:bg-white/[0.05] transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-xs text-ink-faint tracking-wide">{report.code}</p>
            <h3 className="text-xl mt-1 tracking-tight">{report.age} años</h3>
            <p className="text-sm text-ink-dim mt-0.5">{report.institution}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-faint group-hover:text-cyan group-hover:translate-x-0.5 transition-all" />
        </div>

        <div className="flex justify-center my-4">
          <MiniRadar domains={report.domains} />
        </div>

        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-ink-dim">
          <span className="font-mono">{report.date}</span>
          <span>
            {lowCount > 0 && (
              <span className="text-bad">● {lowCount} a fortalecer</span>
            )}
            {lowCount > 0 && highCount > 0 && ' · '}
            {highCount > 0 && <span className="text-good">★ {highCount} destacada{highCount > 1 ? 's' : ''}</span>}
            {lowCount === 0 && highCount === 0 && <span className="text-cyan">● en rango esperado</span>}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
