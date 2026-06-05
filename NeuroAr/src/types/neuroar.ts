// Tipos centrales de NeuroAr Informes Inteligentes.
// Los pacientes están SIEMPRE anonimizados: se identifican por `code`, nunca por nombre real.

export type DomainRange = "bajo" | "esperado" | "destacado";

export type CognitiveDomainResult = {
  domain: string;
  percentile: number;
  range: DomainRange;
  notes?: string;
};

export type Professional = {
  name: string;
  licenseNo?: string;
};

// Serie longitudinal (p. ej. intentos sucesivos de una prueba de memoria).
// Permite visualizar progreso/variabilidad además del perfil por dominios.
export type AttemptPoint = {
  intento: number;
  aciertos: number;
  errores: number;
  tiempoSeg?: number;
};

export type LongitudinalSeries = {
  label: string; // p. ej. "Prueba de memoria de trabajo"
  unit: string; // p. ej. "aciertos"
  maxScore: number; // tope de la escala (para % de logro)
  attempts: AttemptPoint[];
};

export type Patient = {
  id: string;
  code: string; // p. ej. "NA-2026-001" — identificador anónimo
  age: number;
  institution: string;
  context: string;
  assessmentDate: string; // ISO date
  professional: Professional;
  results: CognitiveDomainResult[];
  clinicalTags?: string[]; // antecedentes/contexto reportado (p. ej. "TDAH (reportado)")
  longitudinal?: LongitudinalSeries; // opcional: seguimiento por intentos
};

export type RecommendationCategory = "familia" | "institucion" | "profesional";

export type ReportContent = {
  interpretacionPorDominio: {
    dominio: string;
    interpretacion: string;
    evidencia: string;
  }[];
  recomendaciones: {
    categoria: RecommendationCategory;
    recomendacion: string;
  }[];
  resumenParaPadres: string;
  limitaciones: string;
};

export type ReportStatus = "not_generated" | "draft" | "validated";

export type Report = {
  id: string;
  patientId: string;
  status: ReportStatus;
  aiContent?: ReportContent;
  editedContent?: ReportContent;
  source?: "ia" | "fallback"; // origen del contenido generado (para transparencia/pitch)
  validatedBy?: string;
  validatedAt?: string; // ISO datetime
};
