import type { Patient, ReportContent } from "../types/neuroar";
import { generateFallbackReport } from "./reportGenerator";
import { buildAssessmentPayload } from "./aiPrompt";
import { getSupabase } from "./supabaseClient";

export type GenerateResult = {
  content: ReportContent;
  source: "ia" | "fallback";
};

// Genera el contenido del informe.
// 1) Intenta la Edge Function `generate-report` (LLM real, key en el servidor).
// 2) Ante cualquier error / ausencia de configuración / timeout -> fallback determinístico.
// La demo NUNCA falla por no tener API key o red.
export async function generateReportContent(
  patient: Patient
): Promise<GenerateResult> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { assessment: buildAssessmentPayload(patient) },
      });
      clearTimeout(timeout);

      if (!error && data && isReportContent(data)) {
        return { content: data as ReportContent, source: "ia" };
      }
      // eslint-disable-next-line no-console
      console.warn("[aiClient] Edge Function no devolvió contenido válido, usando fallback.", error);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[aiClient] Error invocando Edge Function, usando fallback.", err);
    }
  }

  // Fallback local determinístico (simula latencia breve para una UX realista).
  await new Promise((r) => setTimeout(r, 600));
  return { content: generateFallbackReport(patient), source: "fallback" };
}

function isReportContent(value: unknown): value is ReportContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.interpretacionPorDominio) &&
    Array.isArray(v.recomendaciones) &&
    typeof v.resumenParaPadres === "string" &&
    typeof v.limitaciones === "string"
  );
}
