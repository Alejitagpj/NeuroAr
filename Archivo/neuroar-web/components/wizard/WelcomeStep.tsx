'use client';

import { motion } from 'framer-motion';
import type { Report } from '@/lib/reports';
import { useMode } from '@/lib/mode';

export function WelcomeStep({ report }: { report: Report }) {
  const { mode } = useMode();
  const low = report.domains.filter((d) => d.range === 'bajo');
  const high = report.domains.filter((d) => d.range === 'destacado');

  const intro =
    mode === 'family'
      ? 'Vamos a recorrer juntos los resultados de este informe. No es un diagnóstico — es una foto de un momento.'
      : `Recorrido clínico estructurado del informe ${report.code}. Validado por ${report.professional.name}.`;

  return (
    <div className="max-w-3xl">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-xs uppercase tracking-widest text-cyan mb-4"
      >
        Bienvenida
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="display text-5xl md:text-7xl text-balance"
      >
        {mode === 'family' ? (
          <>Hablemos del informe<br />de <span className="text-shimmer">{report.age} años</span>.</>
        ) : (
          <>Perfil cognitivo<br /><span className="text-shimmer">{report.code}</span></>
        )}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg text-ink-dim max-w-2xl leading-relaxed"
      >
        {intro}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-12 grid sm:grid-cols-2 gap-4"
      >
        <div className="glass p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">
            Contexto
          </p>
          <p className="text-ink leading-relaxed">{report.context}</p>
        </div>
        <div className="glass p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-2">
            Datos
          </p>
          <ul className="space-y-1.5 text-sm text-ink-dim">
            <li><span className="text-ink-faint">Edad:</span> {report.age} años</li>
            <li><span className="text-ink-faint">Fecha:</span> {report.date}</li>
            <li><span className="text-ink-faint">Institución:</span> {report.institution}</li>
            <li><span className="text-ink-faint">Profesional:</span> {report.professional.name}</li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-wrap gap-3 text-sm"
      >
        {high.length > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-good/10 border border-good/30 text-good">
            ★ {high.length} fortaleza{high.length > 1 ? 's' : ''}: {high.map((d) => d.label.toLowerCase()).join(', ')}
          </span>
        )}
        {low.length > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-bad/10 border border-bad/30 text-bad">
            ● {low.length} área{low.length > 1 ? 's' : ''} a fortalecer: {low.map((d) => d.label.toLowerCase()).join(', ')}
          </span>
        )}
      </motion.div>
    </div>
  );
}
