import type { Patient } from "../types/neuroar";

// ───────────────────────────────────────────────────────────────────────────
// CAPA DE INGESTA MULTIMODAL  (Gemini extrae · Claude analiza)
//
// Arquitectura de IA de NeuroAr en dos etapas, con responsabilidades separadas:
//
//   1) INGESTA  → Gemini (multimodal):
//      Recibe el archivo crudo tal como llega del consultorio o la institución
//      (PDF, Word/DOCX, HTML, imagen escaneada/foto). Lo "lee" y EXTRAE datos
//      estructurados y anonimizados: dominios, percentiles, series de intentos,
//      contexto. No interpreta clínicamente, solo estructura.
//
//   2) ANÁLISIS → Claude (texto/razonamiento):
//      Toma la estructura extraída y produce la interpretación prudente, las
//      recomendaciones, el resumen para familias y la conversación de apoyo.
//      (ver `aiClient.ts` / `aiPrompt.ts`).
//
// Esta separación aprovecha lo mejor de cada modelo: Gemini para entrada
// heterogénea/visual; Claude para redacción clínica y conversación.
//
// En producción la extracción corre en el servidor (Edge Function / backend PHP)
// para mantener las API keys fuera del navegador. En la demo, si no hay backend,
// se usa una extracción simulada para que el flujo NUNCA falle.
// ───────────────────────────────────────────────────────────────────────────

export type SourceKind = "pdf" | "docx" | "html" | "image" | "unknown";

// Resultado estructurado de la etapa de ingesta (lo que Gemini debe devolver).
export type ExtractedAssessment = {
  code: string; // identificador anónimo sugerido
  age?: number;
  institution?: string;
  context?: string;
  assessmentDate?: string;
  clinicalTags?: string[];
  results: { domain: string; percentile: number }[];
  longitudinal?: Patient["longitudinal"];
  sourceKind: SourceKind;
  confidence: number; // 0..1 — confianza de la extracción (para revisión humana)
};

export function detectSourceKind(fileName: string, mime?: string): SourceKind {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  if (mime?.includes("pdf") || ext === "pdf") return "pdf";
  if (mime?.includes("word") || ext === "doc" || ext === "docx") return "docx";
  if (mime?.includes("html") || ext === "html" || ext === "htm") return "html";
  if (mime?.startsWith("image/") || ["png", "jpg", "jpeg", "webp"].includes(ext)) return "image";
  return "unknown";
}

// Contrato de la etapa de ingesta. Implementación real = Gemini en el servidor.
export interface AssessmentExtractor {
  readonly kind: "gemini" | "mock";
  extract(file: { name: string; mime?: string; bytes?: ArrayBuffer }): Promise<ExtractedAssessment>;
}

// Extractor simulado (demo): produce una estructura plausible sin depender de red.
// Útil para mostrar el flujo end-to-end cuando aún no hay backend conectado.
export const mockExtractor: AssessmentExtractor = {
  kind: "mock",
  async extract(file) {
    await new Promise((r) => setTimeout(r, 900)); // latencia realista
    const sourceKind = detectSourceKind(file.name, file.mime);
    const seed = Math.floor(Math.random() * 900) + 100;
    const rnd = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
    return {
      code: `NA-2026-${seed}`,
      age: rnd(8, 16),
      institution: "Importado (pendiente de revisión)",
      context: "Datos extraídos automáticamente del archivo cargado. Requiere validación profesional.",
      assessmentDate: new Date().toISOString().slice(0, 10),
      results: [
        { domain: "Atención", percentile: rnd(10, 85) },
        { domain: "Memoria", percentile: rnd(10, 85) },
        { domain: "Funciones ejecutivas", percentile: rnd(10, 85) },
        { domain: "Lenguaje", percentile: rnd(10, 85) },
        { domain: "Velocidad de procesamiento", percentile: rnd(10, 85) },
        { domain: "Habilidades visuoespaciales", percentile: rnd(10, 85) },
      ],
      sourceKind,
      confidence: 0.72,
    };
  },
};

// Selecciona el extractor. Cuando exista backend de extracción (Gemini), se
// inyecta aquí mediante VITE_INGEST_PROVIDER=gemini.
export function selectExtractor(): AssessmentExtractor {
  // const choice = (import.meta.env.VITE_INGEST_PROVIDER as string | undefined)?.toLowerCase();
  // if (choice === "gemini") return geminiExtractor; // (servidor) — pendiente de cableado
  return mockExtractor;
}
