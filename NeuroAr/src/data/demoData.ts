import type { Patient } from "../types/neuroar";
import { rangeFromPercentile } from "../lib/rangeUtils";

const PROFESSIONAL = {
  name: "Dra. Laura Méndez",
  licenseNo: "TP-PSC-48217",
};

const DOMAINS = [
  "Atención",
  "Memoria",
  "Funciones ejecutivas",
  "Lenguaje",
  "Velocidad de procesamiento",
  "Habilidades visuoespaciales",
] as const;

// Helper: arma los resultados a partir de percentiles, derivando el rango por regla.
function buildResults(percentiles: number[]) {
  return DOMAINS.map((domain, i) => ({
    domain,
    percentile: percentiles[i],
    range: rangeFromPercentile(percentiles[i]),
  }));
}

export const DEMO_PATIENTS: Patient[] = [
  {
    id: "p1",
    code: "NA-2026-001",
    age: 9,
    institution: "Colegio Horizonte",
    context: "Dificultades atencionales reportadas en aula.",
    assessmentDate: "2026-05-21",
    professional: PROFESSIONAL,
    // Atención, Memoria, FE, Lenguaje, Vel. proc., Visuoespacial
    results: buildResults([18, 42, 22, 55, 28, 60]),
  },
  {
    id: "p2",
    code: "NA-2026-002",
    age: 12,
    institution: "Centro NeuroAr Aliado",
    context: "Seguimiento de habilidades de aprendizaje.",
    assessmentDate: "2026-05-24",
    professional: PROFESSIONAL,
    results: buildResults([48, 35, 40, 72, 50, 68]),
  },
  {
    id: "p3",
    code: "NA-2026-003",
    age: 15,
    institution: "Programa de Orientación Vocacional",
    context: "Perfil cognitivo para acompañamiento académico.",
    assessmentDate: "2026-05-28",
    professional: PROFESSIONAL,
    results: buildResults([62, 58, 75, 64, 46, 80]),
  },
  {
    // Caso anonimizado a partir de un informe real de prueba de memoria (adulto, TDAH reportado).
    // Muestra el seguimiento longitudinal: mejora con variabilidad a lo largo de los intentos.
    id: "p9",
    code: "NA-2026-009",
    age: 28,
    institution: "Programa de Bienestar Cognitivo (Adultos)",
    context:
      "Evaluación de memoria de trabajo con intentos sucesivos. Antecedente de TDAH reportado. " +
      "Contexto laboral de alta demanda cognitiva (ingeniería de sistemas).",
    assessmentDate: "2026-05-05",
    professional: PROFESSIONAL,
    clinicalTags: ["TDAH (reportado)", "Seguimiento longitudinal", "Adulto"],
    // Atención, Memoria, FE, Lenguaje, Vel. proc., Visuoespacial
    results: buildResults([30, 45, 38, 70, 52, 66]),
    longitudinal: {
      label: "Prueba de memoria de trabajo (secuencias)",
      unit: "aciertos",
      maxScore: 10,
      attempts: [
        { intento: 1, aciertos: 5, errores: 5, tiempoSeg: 42 },
        { intento: 2, aciertos: 4, errores: 6, tiempoSeg: 39 },
        { intento: 3, aciertos: 6, errores: 4, tiempoSeg: 37 },
        { intento: 4, aciertos: 5, errores: 5, tiempoSeg: 35 },
        { intento: 5, aciertos: 7, errores: 3, tiempoSeg: 33 },
        { intento: 6, aciertos: 6, errores: 4, tiempoSeg: 31 },
        { intento: 7, aciertos: 8, errores: 2, tiempoSeg: 29 },
        { intento: 8, aciertos: 10, errores: 0, tiempoSeg: 27 },
      ],
    },
  },
];
