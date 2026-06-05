import type { DomainResult } from '@/lib/reports';
import type { Mode } from '@/lib/mode';

export function quickRepliesFor(d: DomainResult, mode: Mode): string[] {
  const familyBase = [
    `¿Qué significa percentil ${d.percentile} en ${d.label.toLowerCase()}?`,
  ];
  const profBase = [
    `Resume el hallazgo en ${d.label.toLowerCase()} en una línea clínica.`,
  ];
  if (d.range === 'bajo') {
    return mode === 'family'
      ? [
          ...familyBase,
          `¿Qué puedo hacer en casa para apoyar ${d.label.toLowerCase()}?`,
          '¿Esto define a mi hijo o hija?',
        ]
      : [
          ...profBase,
          'Sugiere estrategias de apoyo en aula basadas en el informe.',
          '¿Qué seguimiento sería razonable proponer?',
        ];
  }
  if (d.range === 'destacado') {
    return mode === 'family'
      ? [
          ...familyBase,
          `¿Cómo aprovecho esta fortaleza en ${d.label.toLowerCase()}?`,
          '¿Sirve para elegir actividades extracurriculares?',
        ]
      : [
          ...profBase,
          '¿Cómo apalancar esta fortaleza en el plan de acompañamiento?',
        ];
  }
  return mode === 'family'
    ? [
        ...familyBase,
        `¿Hay algo que reforzar en ${d.label.toLowerCase()}?`,
      ]
    : [
        ...profBase,
        '¿Conviene profundizar este dominio en próximos cortes?',
      ];
}
