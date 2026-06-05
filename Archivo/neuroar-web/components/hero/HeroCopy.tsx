'use client';

import { motion } from 'framer-motion';

const lines = ['Entender', 'un informe', 'neuropsicológico', 'no debería ser', 'un PDF.'];

export function HeroCopy() {
  return (
    <div>
      <p className="text-ink-dim font-mono text-sm tracking-wide uppercase mb-6">
        NeuroAR · informes inteligentes
      </p>
      <h1 className="display text-[clamp(2.6rem,8vw,7rem)] text-balance max-w-[14ch]">
        {lines.map((line, i) => (
          <motion.span
            key={line}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {line}
          </motion.span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 text-lg md:text-xl text-ink-dim max-w-xl leading-relaxed"
      >
        Recorridos guiados por IA generativa con base en evidencia validada por un profesional. Sin
        diagnóstico. Sin jerga innecesaria.
      </motion.p>
    </div>
  );
}
