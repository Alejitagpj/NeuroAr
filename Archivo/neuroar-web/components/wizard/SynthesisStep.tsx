'use client';

import { motion } from 'framer-motion';
import type { Report } from '@/lib/reports';
import { useMode } from '@/lib/mode';
import { MiniRadar } from '@/components/reports/MiniRadar';
import { askChat } from '@/lib/chatBus';
import { ShieldCheck, MessageSquare, Printer } from 'lucide-react';

export function SynthesisStep({ report }: { report: Report }) {
  const { mode } = useMode();
  const family = report.recommendations.find((r) => r.audience === 'family');
  const institution = report.recommendations.find((r) => r.audience === 'institution');
  const professional = report.recommendations.find((r) => r.audience === 'professional');

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-xs uppercase tracking-widest text-cyan mb-4"
      >
        Síntesis
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="display text-5xl md:text-7xl text-balance max-w-3xl"
      >
        Lo que el informe<br />nos cuenta <span className="text-shimmer">en conjunto</span>.
      </motion.h2>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 mt-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 flex flex-col items-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3 self-start">
            Perfil cognitivo
          </p>
          <MiniRadar domains={report.domains} size={320} />
          <div className="mt-6 grid grid-cols-2 gap-3 w-full text-xs">
            {report.domains.map((d) => (
              <div key={d.key} className="flex items-center justify-between">
                <span className="text-ink-dim truncate">{d.label}</span>
                <span className="font-mono text-ink">{d.percentile}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          {family && (
            <RecCard title="Para la familia" body={family.text} />
          )}
          {institution && (
            <RecCard title="Para la institución" body={institution.text} />
          )}
          {mode === 'professional' && professional && (
            <RecCard title="Para el profesional" body={professional.text} />
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 glass-strong p-6 md:p-8"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan mb-3">
          Resumen para padres / tutores
        </p>
        <p className="text-ink leading-relaxed text-[17px]">{report.parentSummary}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex flex-wrap items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-cyan/10 border border-cyan/30 text-cyan">
          <ShieldCheck className="w-3.5 h-3.5" />
          Validado el {report.validation.date} por {report.validation.by}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <button
          onClick={() => askChat('Resume el informe en 3 ideas clave que deba recordar.')}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-cyan text-bg ring-glow font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Hablar con el asistente
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-xl glass hover:border-line-strong"
        >
          <Printer className="w-4 h-4" />
          Imprimir
        </button>
      </motion.div>

      <p className="mt-10 text-xs text-ink-faint leading-relaxed max-w-3xl">
        ⚠ <span className="text-ink-dim">Limitaciones:</span> {report.limitations}
      </p>
    </div>
  );
}

function RecCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">{title}</p>
      <p className="text-ink leading-relaxed">{body}</p>
    </div>
  );
}
