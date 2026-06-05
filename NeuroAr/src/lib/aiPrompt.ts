import type { Patient } from "../types/neuroar";

// Construye el payload anonimizado que se envía al modelo.
// IMPORTANTE: nunca se incluyen nombres ni datos identificables, solo el código.
export function buildAssessmentPayload(patient: Patient) {
  return {
    codigo: patient.code,
    edad: patient.age,
    contexto: patient.context,
    resultados: patient.results.map((r) => ({
      dominio: r.domain,
      percentil: r.percentile,
      rango: r.range,
    })),
  };
}

export const SYSTEM_PROMPT = `Actúa como asistente de redacción clínica para informes neuropsicológicos. No diagnostiques. No reemplaces el criterio profesional. Tu tarea es transformar resultados estructurados de evaluación en una interpretación prudente, recomendaciones accionables y un resumen claro para padres o tutores.

Reglas:
- No inventes pruebas ni antecedentes no incluidos.
- No uses nombres propios ni datos identificables.
- Usa lenguaje profesional, claro y empático.
- Distingue observaciones de hipótesis.
- Incluye limitaciones si los datos son insuficientes.
- La salida debe ser JSON válido.
- El informe debe requerir validación profesional.

Devuelve exclusivamente JSON con esta estructura:
{
  "interpretacionPorDominio": [
    { "dominio": "...", "interpretacion": "...", "evidencia": "..." }
  ],
  "recomendaciones": [
    { "categoria": "familia | institucion | profesional", "recomendacion": "..." }
  ],
  "resumenParaPadres": "...",
  "limitaciones": "..."
}`;

export function buildUserPrompt(patient: Patient): string {
  return `Entrada:\n${JSON.stringify(buildAssessmentPayload(patient), null, 2)}`;
}
