import type { DomainKey } from './reports';

export interface DomainMeta {
  key: DomainKey;
  label: string;
  short: string;
  description: string;
  familyDescription: string;
}

export const DOMAIN_META: Record<DomainKey, DomainMeta> = {
  atencion: {
    key: 'atencion',
    label: 'Atención',
    short: 'Atn',
    description: 'Capacidad de focalizar y mantener la concentración en una tarea filtrando distractores.',
    familyDescription: 'Qué tan bien puede concentrarse y mantenerse en lo que está haciendo.',
  },
  memoria: {
    key: 'memoria',
    label: 'Memoria',
    short: 'Mem',
    description: 'Codificación, retención y evocación de información verbal y visual.',
    familyDescription: 'Qué tan bien recuerda información reciente y la usa después.',
  },
  funciones_ejecutivas: {
    key: 'funciones_ejecutivas',
    label: 'Funciones ejecutivas',
    short: 'FFEE',
    description: 'Planificación, organización, flexibilidad cognitiva e inhibición.',
    familyDescription: 'Qué tan bien organiza, planea y se adapta cuando las cosas cambian.',
  },
  lenguaje: {
    key: 'lenguaje',
    label: 'Lenguaje',
    short: 'Leng',
    description: 'Comprensión y expresión verbal, vocabulario y fluidez.',
    familyDescription: 'Qué tan bien entiende lo que escucha y se expresa con palabras.',
  },
  velocidad_procesamiento: {
    key: 'velocidad_procesamiento',
    label: 'Velocidad de procesamiento',
    short: 'Vel',
    description: 'Rapidez con que percibe y responde a información sencilla.',
    familyDescription: 'Qué tan rápido procesa información sencilla y responde.',
  },
  habilidades_visuoespaciales: {
    key: 'habilidades_visuoespaciales',
    label: 'Habilidades visuoespaciales',
    short: 'VsEsp',
    description: 'Análisis e integración de información visual y espacial.',
    familyDescription: 'Qué tan bien interpreta lo que ve y entiende el espacio.',
  },
};

export const DOMAIN_ORDER: DomainKey[] = [
  'atencion',
  'memoria',
  'funciones_ejecutivas',
  'lenguaje',
  'velocidad_procesamiento',
  'habilidades_visuoespaciales',
];
