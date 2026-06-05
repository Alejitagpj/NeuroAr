import type {
  CognitiveDomainResult,
  Patient,
  ReportContent,
} from "../types/neuroar";

// Fallback determinístico de ALTA calidad.
// Convierte puntajes por dominio en un informe prudente y NO diagnóstico.
// Lenguaje permitido: "los resultados sugieren…", "se observa un desempeño…".
// Lenguaje prohibido: "el paciente tiene…", "se diagnostica…", "presenta trastorno…".

type Phrasing = {
  desempeno: string;
  interpretacion: (domain: string) => string;
};

const RANGE_PHRASING: Record<CognitiveDomainResult["range"], Phrasing> = {
  bajo: {
    desempeno: "un desempeño por debajo de lo esperado para su grupo de edad",
    interpretacion: (d) =>
      `Los resultados sugieren un rendimiento inferior al rango esperado en ${d.toLowerCase()}. ` +
      `Este patrón podría asociarse con una mayor demanda de apoyo en tareas que involucran esta función. ` +
      `Se recomienda que el profesional valide esta observación con datos cualitativos y de contexto.`,
  },
  esperado: {
    desempeno: "un desempeño dentro del rango esperado para su edad",
    interpretacion: (d) =>
      `Se observa un desempeño dentro del rango esperado en ${d.toLowerCase()}. ` +
      `Los resultados sugieren un funcionamiento acorde a lo previsto para su grupo de referencia.`,
  },
  destacado: {
    desempeno: "un desempeño por encima del rango esperado para su edad",
    interpretacion: (d) =>
      `Los resultados sugieren un desempeño destacado en ${d.toLowerCase()}, ` +
      `por encima del rango esperado. Este perfil podría representar un área de fortaleza ` +
      `susceptible de ser aprovechada en el acompañamiento.`,
  },
};

function evidenceFor(r: CognitiveDomainResult): string {
  const { desempeno } = RANGE_PHRASING[r.range];
  return `Percentil ${r.percentile} en ${r.domain.toLowerCase()}, indicando ${desempeno}.`;
}

export function generateFallbackReport(patient: Patient): ReportContent {
  const interpretacionPorDominio = patient.results.map((r) => ({
    dominio: r.domain,
    interpretacion: RANGE_PHRASING[r.range].interpretacion(r.domain),
    evidencia: evidenceFor(r),
  }));

  const bajos = patient.results.filter((r) => r.range === "bajo");
  const destacados = patient.results.filter((r) => r.range === "destacado");

  const recomendaciones: ReportContent["recomendaciones"] = [];

  if (bajos.length > 0) {
    const lista = bajos.map((r) => r.domain.toLowerCase()).join(", ");
    recomendaciones.push({
      categoria: "institucion",
      recomendacion:
        `Considerar estrategias de apoyo en el entorno educativo para las áreas con desempeño ` +
        `inferior al esperado (${lista}), como ajustes razonables, segmentación de tareas y ` +
        `refuerzo positivo, sujeto a la valoración del profesional.`,
    });
    recomendaciones.push({
      categoria: "familia",
      recomendacion:
        `Acompañar en casa con rutinas estructuradas y espacios libres de distracción que ` +
        `favorezcan las áreas a fortalecer, evitando comparaciones y priorizando el refuerzo positivo.`,
    });
  } else {
    recomendaciones.push({
      categoria: "institucion",
      recomendacion:
        `Dar continuidad al acompañamiento habitual y monitorear la evolución en próximos cortes, ` +
        `manteniendo un entorno que sostenga el desempeño observado.`,
    });
  }

  if (destacados.length > 0) {
    const lista = destacados.map((r) => r.domain.toLowerCase()).join(", ");
    recomendaciones.push({
      categoria: "familia",
      recomendacion:
        `Potenciar las áreas de fortaleza identificadas (${lista}) mediante actividades ` +
        `enriquecedoras acordes a los intereses del menor.`,
    });
  }

  recomendaciones.push({
    categoria: "profesional",
    recomendacion:
      `Validar las interpretaciones con la observación clínica, los antecedentes y el contexto ` +
      `escolar/familiar antes de emitir conclusiones. Considerar evaluación de seguimiento si se ` +
      `requiere mayor precisión.`,
  });

  const areasFoco =
    bajos.length > 0
      ? `Se identificaron áreas que podrían beneficiarse de mayor apoyo (${bajos
          .map((r) => r.domain.toLowerCase())
          .join(", ")}).`
      : `En conjunto, los resultados se ubican dentro de lo esperado para su edad.`;

  const fortalezas =
    destacados.length > 0
      ? ` También se observaron fortalezas en ${destacados
          .map((r) => r.domain.toLowerCase())
          .join(", ")}.`
      : "";

  const resumenParaPadres =
    `Este informe resume cómo le fue a su hijo o hija en distintas habilidades de pensamiento ` +
    `(como prestar atención, recordar información u organizar tareas). ${areasFoco}${fortalezas} ` +
    `Estos resultados son una foto de un momento y no definen su capacidad ni su futuro. ` +
    `El profesional revisará esta información junto con ustedes para acordar los próximos pasos de ` +
    `acompañamiento. Ante cualquier duda, no dude en consultarlo con el equipo.`;

  const limitaciones =
    `Este informe se basa únicamente en la información disponible en la evaluación realizada y en ` +
    `los puntajes por dominio. No incorpora antecedentes médicos, historia clínica completa ni ` +
    `observación directa adicional. Los resultados pueden verse influidos por factores como el ` +
    `estado emocional, el cansancio o el contexto de aplicación. Requiere la validación de un ` +
    `profesional autorizado y no constituye un diagnóstico.`;

  return {
    interpretacionPorDominio,
    recomendaciones,
    resumenParaPadres,
    limitaciones,
  };
}
