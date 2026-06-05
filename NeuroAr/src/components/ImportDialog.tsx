import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import {
  detectSourceKind,
  extractedToPatient,
  selectExtractor,
  type ExtractedAssessment,
  type SourceKind,
} from "../lib/ingest";

type Phase = "idle" | "reading" | "review" | "error";

const KIND_LABEL: Record<SourceKind, string> = {
  pdf: "PDF",
  docx: "Word",
  html: "HTML",
  image: "Imagen",
  unknown: "Archivo",
};

// Demuestra la ingesta multimodal end-to-end:
//   1) Gemini "lee" el archivo (PDF/Word/HTML/imagen) y EXTRAE datos estructurados.
//   2) Claude ANALIZA al generar el informe (en la ficha del paciente).
export function ImportDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { importPatient } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("");
  const [kind, setKind] = useState<SourceKind>("unknown");
  const [extracted, setExtracted] = useState<ExtractedAssessment | null>(null);

  const extractor = selectExtractor();

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    setKind(detectSourceKind(file.name, file.type));
    setPhase("reading");
    try {
      const bytes = await file.arrayBuffer().catch(() => undefined);
      const ex = await extractor.extract({ name: file.name, mime: file.type, bytes });
      setExtracted(ex);
      setPhase("review");
    } catch {
      setPhase("error");
    }
  };

  const confirm = () => {
    if (!extracted) return;
    const patient = extractedToPatient(extracted);
    importPatient(patient);
    onClose();
    navigate(`/app/paciente/${patient.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* encabezado */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Importar evaluación</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Gemini lee el archivo y extrae los datos · Claude redacta el informe · el profesional valida
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Cerrar">✕</button>
        </div>

        <div className="px-6 py-5">
          {/* pasos del pipeline */}
          <Pipeline phase={phase} />

          {phase === "idle" && (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50/40"
            >
              <div className="text-3xl">📄</div>
              <p className="mt-2 text-sm font-medium text-ink-800">Arrastra un archivo o haz clic</p>
              <p className="mt-1 text-xs text-slate-500">PDF · Word · HTML · imagen (foto o escaneo)</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.html,.htm,image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          )}

          {phase === "reading" && (
            <div className="mt-5 rounded-xl bg-slate-50 px-6 py-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <p className="mt-3 text-sm font-medium text-ink-800">
                Gemini está leyendo <span className="font-semibold">{fileName}</span>…
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Extrayendo dominios y puntajes del {KIND_LABEL[kind].toLowerCase()} (multimodal)
              </p>
            </div>
          )}

          {phase === "review" && extracted && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  ✓ Datos extraídos — {KIND_LABEL[extracted.sourceKind]}
                </span>
                <span className="text-xs text-slate-500">
                  Confianza {Math.round(extracted.confidence * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                <Field label="Código" value={extracted.code} />
                <Field label="Edad" value={extracted.age ? `${extracted.age} años` : "—"} />
                <Field label="Institución" value={extracted.institution ?? "—"} />
                <Field label="Fecha" value={extracted.assessmentDate ?? "—"} />
              </div>
              <div className="mt-3 space-y-1">
                {extracted.results.map((r) => (
                  <div key={r.domain} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-1.5 text-sm">
                    <span className="text-ink-800">{r.domain}</span>
                    <span className="font-medium text-ink-900">Pctl. {r.percentile}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Revisa los datos extraídos. Al crear el paciente, Claude podrá redactar el informe y
                el profesional lo validará.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setPhase("idle")} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Cambiar archivo
                </button>
                <button onClick={confirm} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                  Crear paciente y analizar →
                </button>
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="mt-5 rounded-xl bg-red-50 px-6 py-8 text-center text-sm text-red-700">
              No se pudo leer el archivo. Intenta con otro formato.
              <div className="mt-3">
                <button onClick={() => setPhase("idle")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100">
                  Reintentar
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Demo: la extracción corre simulada en el navegador. En producción, Gemini procesa el
            archivo en el servidor (las claves nunca salen al cliente).
          </p>
        </div>
      </div>
    </div>
  );
}

function Pipeline({ phase }: { phase: Phase }) {
  const steps = [
    { key: "reading", icon: "🔍", label: "Gemini lee" },
    { key: "review", icon: "🧩", label: "Datos extraídos" },
    { key: "done", icon: "🧠", label: "Claude analiza" },
  ];
  const activeIndex = phase === "reading" ? 0 : phase === "review" ? 1 : -1;
  return (
    <div className="flex items-center justify-center gap-2 text-[11px]">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ring-1 ${
              i <= activeIndex
                ? "bg-brand-50 text-brand-700 ring-brand-200"
                : "bg-slate-50 text-slate-400 ring-slate-200"
            }`}
          >
            <span aria-hidden>{s.icon}</span> {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-slate-300">→</span>}
        </div>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="truncate text-ink-800" title={value}>{value}</div>
    </div>
  );
}
