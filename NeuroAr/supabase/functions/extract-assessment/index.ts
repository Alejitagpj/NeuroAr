// Supabase Edge Function `extract-assessment` (Deno).
// ETAPA DE INGESTA (multimodal) → Gemini.
// Recibe un archivo (PDF / Word / HTML / imagen) en base64 y devuelve datos
// estructurados y ANONIMIZADOS (ExtractedAssessment). La API key vive aquí, nunca
// en el cliente.
//
// Configurar:  supabase secrets set GEMINI_API_KEY=...
// (opcional)   supabase secrets set GEMINI_MODEL=gemini-2.5-flash
// Deploy:      supabase functions deploy extract-assessment

const EXTRACTION_PROMPT = `Eres un extractor de datos para informes neuropsicológicos. Te entregan un archivo (PDF, Word, HTML o imagen) con resultados de una evaluación. Tu tarea es LEER y EXTRAER datos estructurados. NO interpretes clínicamente, NO diagnostiques, NO inventes datos que no estén en el archivo.

Reglas:
- ANONIMIZA: nunca incluyas nombres propios ni datos identificables. Si hay un nombre, ignóralo y genera un código anónimo tipo "NA-2026-XXX".
- Normaliza los dominios cognitivos a esta lista cuando sea posible: "Atención", "Memoria", "Funciones ejecutivas", "Lenguaje", "Velocidad de procesamiento", "Habilidades visuoespaciales".
- Los percentiles van de 0 a 100. Si el archivo da puntajes en otra escala, conviértelos de forma razonable a percentil aproximado.
- Si hay una serie de intentos sucesivos (p. ej. prueba de memoria por ensayos), inclúyela en "longitudinal".
- "confidence" es tu confianza (0 a 1) en la extracción, para guiar la revisión humana.

Devuelve EXCLUSIVAMENTE JSON válido con esta estructura (sin texto adicional):
{
  "code": "NA-2026-XXX",
  "age": number | null,
  "institution": string | null,
  "context": string | null,
  "assessmentDate": "YYYY-MM-DD" | null,
  "clinicalTags": string[],
  "results": [ { "domain": "string", "percentile": number } ],
  "longitudinal": { "label": "string", "unit": "string", "maxScore": number, "attempts": [ { "intento": number, "aciertos": number, "errores": number } ] } | null,
  "confidence": number
}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // El cliente envía { fileBase64, mimeType, fileName }.
    const { fileBase64, mimeType, fileName } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "missing_api_key" }, 400);
    if (!fileBase64 || !mimeType) return json({ error: "missing_file" }, 400);

    const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { inline_data: { mime_type: mimeType, data: fileBase64 } },
              { text: `${EXTRACTION_PROMPT}\n\nArchivo: ${fileName ?? "evaluación"}` },
            ],
          },
        ],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) return json({ error: "gemini_error", detail: await res.text() }, 502);

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = extractJson(text);
    if (!parsed) return json({ error: "invalid_extraction", raw: text }, 502);

    // Adjunta el tipo de fuente derivado del mime para el cliente.
    const sourceKind = detectSourceKind(mimeType, fileName);
    return json({ ...parsed, sourceKind }, 200);
  } catch (err) {
    return json({ error: "exception", detail: String(err) }, 500);
  }
});

function detectSourceKind(mime: string, fileName?: string): string {
  const ext = (fileName ?? "").toLowerCase().split(".").pop() ?? "";
  if (mime.includes("pdf") || ext === "pdf") return "pdf";
  if (mime.includes("word") || ext === "doc" || ext === "docx") return "docx";
  if (mime.includes("html") || ext === "html" || ext === "htm") return "html";
  if (mime.startsWith("image/")) return "image";
  return "unknown";
}

function extractJson(text: string): Record<string, unknown> | null {
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
