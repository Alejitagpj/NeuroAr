export type DomainKey =
  | 'atencion'
  | 'memoria'
  | 'funciones_ejecutivas'
  | 'lenguaje'
  | 'velocidad_procesamiento'
  | 'habilidades_visuoespaciales';

export type Range = 'bajo' | 'esperado' | 'destacado';

export interface DomainResult {
  key: DomainKey;
  label: string;
  percentile: number;
  range: Range;
  interpretation: string;
  evidence: string;
}

export interface Recommendation {
  audience: 'family' | 'institution' | 'professional';
  text: string;
}

export interface Report {
  id: string;
  code: string;
  age: number;
  date: string;
  institution: string;
  professional: { name: string; license: string };
  context: string;
  domains: DomainResult[];
  recommendations: Recommendation[];
  parentSummary: string;
  limitations: string;
  validation: { date: string; by: string };
}

const LIMITATIONS =
  'Este informe se basa únicamente en la información disponible en la evaluación realizada y en los puntajes por dominio. No incorpora antecedentes médicos, historia clínica completa ni observación directa adicional. Los resultados pueden verse influidos por factores como el estado emocional, el cansancio o el contexto de aplicación. Requiere la validación de un profesional autorizado y no constituye un diagnóstico.';

const PROFESSIONAL = { name: 'Dra. Laura Méndez', license: 'TP-PSC-48217' };
const VALIDATION = { date: '4 de junio de 2026', by: 'Dra. Laura Méndez' };

const LABELS: Record<DomainKey, string> = {
  atencion: 'Atención',
  memoria: 'Memoria',
  funciones_ejecutivas: 'Funciones ejecutivas',
  lenguaje: 'Lenguaje',
  velocidad_procesamiento: 'Velocidad de procesamiento',
  habilidades_visuoespaciales: 'Habilidades visuoespaciales',
};

function interp(label: string, pct: number, range: Range): string {
  if (range === 'bajo') {
    return `Los resultados sugieren un rendimiento inferior al rango esperado en ${label.toLowerCase()}. Este patrón podría asociarse con una mayor demanda de apoyo en tareas que involucran esta función. Se recomienda que el profesional valide esta observación con datos cualitativos y de contexto.`;
  }
  if (range === 'destacado') {
    return `Los resultados sugieren un desempeño destacado en ${label.toLowerCase()}, por encima del rango esperado. Este perfil podría representar un área de fortaleza susceptible de ser aprovechada en el acompañamiento.`;
  }
  return `Se observa un desempeño dentro del rango esperado en ${label.toLowerCase()}. Los resultados sugieren un funcionamiento acorde a lo previsto para su grupo de referencia.`;
}

function evidence(label: string, pct: number, range: Range): string {
  const desc =
    range === 'bajo'
      ? 'por debajo de lo esperado'
      : range === 'destacado'
        ? 'por encima del rango esperado'
        : 'dentro del rango esperado';
  return `Percentil ${pct} en ${label.toLowerCase()}, indicando un desempeño ${desc} para su edad.`;
}

function mkDomain(key: DomainKey, pct: number, range: Range): DomainResult {
  const label = LABELS[key];
  return { key, label, percentile: pct, range, interpretation: interp(label, pct, range), evidence: evidence(label, pct, range) };
}

export const reports: Report[] = [
  {
    id: 'NA-2026-001',
    code: 'NA-2026-001',
    age: 9,
    date: '21 de mayo de 2026',
    institution: 'Colegio Horizonte',
    professional: PROFESSIONAL,
    context: 'Dificultades atencionales reportadas en aula.',
    domains: [
      mkDomain('atencion', 18, 'bajo'),
      mkDomain('memoria', 42, 'esperado'),
      mkDomain('funciones_ejecutivas', 22, 'bajo'),
      mkDomain('lenguaje', 55, 'esperado'),
      mkDomain('velocidad_procesamiento', 28, 'esperado'),
      mkDomain('habilidades_visuoespaciales', 60, 'esperado'),
    ],
    recommendations: [
      {
        audience: 'family',
        text: 'Acompañar en casa con rutinas estructuradas y espacios libres de distracción que favorezcan las áreas a fortalecer, evitando comparaciones y priorizando el refuerzo positivo.',
      },
      {
        audience: 'institution',
        text: 'Considerar estrategias de apoyo en el entorno educativo para las áreas con desempeño inferior al esperado (atención, funciones ejecutivas), como ajustes razonables, segmentación de tareas y refuerzo positivo, sujeto a la valoración del profesional.',
      },
      {
        audience: 'professional',
        text: 'Validar las interpretaciones con la observación clínica, los antecedentes y el contexto escolar/familiar antes de emitir conclusiones. Considerar evaluación de seguimiento si se requiere mayor precisión.',
      },
    ],
    parentSummary:
      'Este informe resume cómo le fue a su hijo o hija en distintas habilidades de pensamiento (como prestar atención, recordar información u organizar tareas). Se identificaron áreas que podrían beneficiarse de mayor apoyo (atención, funciones ejecutivas). Estos resultados son una foto de un momento y no definen su capacidad ni su futuro. El profesional revisará esta información junto con ustedes para acordar los próximos pasos de acompañamiento. Ante cualquier duda, no dude en consultarlo con el equipo.',
    limitations: LIMITATIONS,
    validation: VALIDATION,
  },
  {
    id: 'NA-2026-002',
    code: 'NA-2026-002',
    age: 12,
    date: '24 de mayo de 2026',
    institution: 'Centro NeuroAr Aliado',
    professional: PROFESSIONAL,
    context: 'Seguimiento de habilidades de aprendizaje.',
    domains: [
      mkDomain('atencion', 48, 'esperado'),
      mkDomain('memoria', 35, 'esperado'),
      mkDomain('funciones_ejecutivas', 40, 'esperado'),
      mkDomain('lenguaje', 72, 'destacado'),
      mkDomain('velocidad_procesamiento', 50, 'esperado'),
      mkDomain('habilidades_visuoespaciales', 68, 'esperado'),
    ],
    recommendations: [
      {
        audience: 'family',
        text: 'Potenciar las áreas de fortaleza identificadas (lenguaje) mediante actividades enriquecedoras acordes a los intereses del menor.',
      },
      {
        audience: 'institution',
        text: 'Dar continuidad al acompañamiento habitual y monitorear la evolución en próximos cortes, manteniendo un entorno que sostenga el desempeño observado.',
      },
      {
        audience: 'professional',
        text: 'Validar las interpretaciones con la observación clínica, los antecedentes y el contexto escolar/familiar antes de emitir conclusiones. Considerar evaluación de seguimiento si se requiere mayor precisión.',
      },
    ],
    parentSummary:
      'Este informe resume cómo le fue a su hijo o hija en distintas habilidades de pensamiento (como prestar atención, recordar información u organizar tareas). En conjunto, los resultados se ubican dentro de lo esperado para su edad. También se observaron fortalezas en lenguaje. Estos resultados son una foto de un momento y no definen su capacidad ni su futuro. El profesional revisará esta información junto con ustedes para acordar los próximos pasos de acompañamiento. Ante cualquier duda, no dude en consultarlo con el equipo.',
    limitations: LIMITATIONS,
    validation: VALIDATION,
  },
  {
    id: 'NA-2026-003',
    code: 'NA-2026-003',
    age: 15,
    date: '28 de mayo de 2026',
    institution: 'Programa de Orientación Vocacional',
    professional: PROFESSIONAL,
    context: 'Perfil cognitivo para acompañamiento académico.',
    domains: [
      mkDomain('atencion', 62, 'esperado'),
      mkDomain('memoria', 58, 'esperado'),
      mkDomain('funciones_ejecutivas', 75, 'destacado'),
      mkDomain('lenguaje', 64, 'esperado'),
      mkDomain('velocidad_procesamiento', 46, 'esperado'),
      mkDomain('habilidades_visuoespaciales', 80, 'destacado'),
    ],
    recommendations: [
      {
        audience: 'family',
        text: 'Potenciar las áreas de fortaleza identificadas (funciones ejecutivas, habilidades visuoespaciales) mediante actividades enriquecedoras acordes a los intereses del menor.',
      },
      {
        audience: 'institution',
        text: 'Dar continuidad al acompañamiento habitual y monitorear la evolución en próximos cortes, manteniendo un entorno que sostenga el desempeño observado.',
      },
      {
        audience: 'professional',
        text: 'Validar las interpretaciones con la observación clínica, los antecedentes y el contexto escolar/familiar antes de emitir conclusiones. Considerar evaluación de seguimiento si se requiere mayor precisión.',
      },
    ],
    parentSummary:
      'Este informe resume cómo le fue a su hijo o hija en distintas habilidades de pensamiento (como prestar atención, recordar información u organizar tareas). En conjunto, los resultados se ubican dentro de lo esperado para su edad. También se observaron fortalezas en funciones ejecutivas, habilidades visuoespaciales. Estos resultados son una foto de un momento y no definen su capacidad ni su futuro. El profesional revisará esta información junto con ustedes para acordar los próximos pasos de acompañamiento. Ante cualquier duda, no dude en consultarlo con el equipo.',
    limitations: LIMITATIONS,
    validation: VALIDATION,
  },
];

export function getReport(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}

export function rangeColor(range: Range): string {
  return range === 'bajo' ? '#FB7185' : range === 'destacado' ? '#34D399' : '#7AE7FF';
}

export function rangeLabel(range: Range): string {
  return range === 'bajo' ? 'Bajo' : range === 'destacado' ? 'Destacado' : 'Esperado';
}
