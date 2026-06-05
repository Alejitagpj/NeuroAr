// Supabase Edge Function `generate-report` (Deno).
// Recibe el assessment ANONIMIZADO y devuelve ReportContent en JSON.
// La API key vive aquí (servidor), NUNCA en el cliente.
// Configurar: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Deploy: supabase functions deploy generate-report

const SYSTEM_PROMPT = `Actúa como asistente de redacción clínica para informes neuropsicológicos. No diagnostiques. No reemplaces el criterio profesional. Tu tarea es transformar resultados estructurados de evaluación en una interpretación prudente, recomendaciones accionables y un resumen claro para padres o tutores.

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
  "interpretacionPorDominio": [ { "dominio": "...", "interpretacion": "...", "evidencia": "..." } ],
  "recomendaciones": [ { "categoria": "familia | institucion | profesional", "recomendacion": "..." } ],
  "resumenParaPadres": "...",
  "limitaciones": "..."
}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { assessment } = await req.json();
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return json({ error: "missing_api_key" }, 400);
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Entrada:\n${JSON.stringify(assessment, null, 2)}\n\nDevuelve exclusivamente el JSON.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return json({ error: "llm_error", detail: await res.text() }, 502);
    }

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const parsed = extractJson(text);
    if (!parsed) return json({ error: "invalid_llm_output" }, 502);

    return json(parsed, 200);
  } catch (err) {
    return json({ error: "exception", detail: String(err) }, 500);
  }
});

function extractJson(text: string): unknown | null {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}
