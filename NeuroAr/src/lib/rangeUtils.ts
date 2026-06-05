import type { DomainRange } from "../types/neuroar";

// Regla de rango interpretativo por percentil:
//   < 25      -> bajo
//   25 .. 69  -> esperado
//   >= 70     -> destacado
export function rangeFromPercentile(percentile: number): DomainRange {
  if (percentile < 25) return "bajo";
  if (percentile < 70) return "esperado";
  return "destacado";
}

export const RANGE_LABEL: Record<DomainRange, string> = {
  bajo: "Bajo",
  esperado: "Esperado",
  destacado: "Destacado",
};

// Colores sobrios para badges/gráficos según rango.
export const RANGE_COLOR: Record<DomainRange, string> = {
  bajo: "#dc2626", // rojo controlado
  esperado: "#2563eb", // azul marca
  destacado: "#16a34a", // verde
};

export const RANGE_BADGE_CLASS: Record<DomainRange, string> = {
  bajo: "bg-red-50 text-red-700 ring-1 ring-red-200",
  esperado: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  destacado: "bg-green-50 text-green-700 ring-1 ring-green-200",
};
