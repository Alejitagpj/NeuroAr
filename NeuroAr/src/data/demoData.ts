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
];
