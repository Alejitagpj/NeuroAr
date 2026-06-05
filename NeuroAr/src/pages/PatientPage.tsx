import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { AssessmentChart } from "../components/AssessmentChart";
import { BrainCanvas } from "../components/BrainCanvas";
import { ReportEditor } from "../components/ReportEditor";
import { ReportStatusBadge } from "../components/ReportStatusBadge";
import { PdfDownloadButton } from "../components/PdfDownloadButton";
import { RANGE_BADGE_CLASS, RANGE_LABEL } from "../lib/rangeUtils";
import type { DomainRange } from "../three/brainGeometry";
import type { ReportContent } from "../types/neuroar";

export function PatientPage() {
  const { id = "" } = useParams();
  const { patients, getReport, generate, updateEdited, validate, loading } = useStore();
  const patient = patients.find((p) => p.id === id);
  const report = getReport(id);

  const [generating, setGenerating] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const status = report?.status ?? "not_generated";
  const validated = status === "validated";

  const validatedBy = patient?.professional.name ?? "Profesional";

  const editedContent: ReportContent | undefined = useMemo(
    () => report?.editedContent ?? report?.aiContent,
    [report]
  );

  const ranges = useMemo<Record<string, DomainRange>>(
    () => Object.fromEntries((patient?.results ?? []).map((r) => [r.domain, r.range])),
    [patient]
  );

  const toggleDomain = (d: string) => setActiveDomain((cur) => (cur === d ? null : d));

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>;
  if (!patient)
    return (
      <div>
        <p className="text-sm text-slate-600">Paciente no encontrado.</p>
        <Link to="/app" className="text-sm text-brand-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>
    );

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generate(patient);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/app" className="text-sm text-brand-600 hover:underline">
          ← Volver al panel
        </Link>
      </div>

      {/* Cabecera del paciente */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-ink-900">{patient.code}</h1>
              <ReportStatusBadge status={status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{patient.context}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            <Meta label="Edad" value={`${patient.age} años`} />
            <Meta label="Institución" value={patient.institution} />
            <Meta label="Evaluación" value={patient.assessmentDate} />
            <Meta label="Profesional" value={patient.professional.name} />
          </div>
        </div>
      </div>

      {/* Mapa cognitivo interactivo */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Mapa cognitivo del paciente</h2>
          <span className="hidden text-xs text-slate-400 sm:block">
            Gira el cerebro y haz clic en una región
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* cerebro 3D interactivo */}
          <div className="relative h-[320px] overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 sm:h-[360px]">
            <BrainCanvas
              className="h-full w-full"
              interactive
              ranges={ranges}
              activeDomain={activeDomain}
              onRegionClick={toggleDomain}
            />
            {/* leyenda */}
            <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 text-[11px] text-white/80">
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-400" />Bajo</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-sky-400" />Esperado</span>
              <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-400" />Destacado</span>
            </div>
          </div>

          {/* lista de dominios sincronizada */}
          <div className="grid content-start gap-2">
            {patient.results.map((r) => {
              const active = activeDomain === r.domain;
              return (
                <button
                  key={r.domain}
                  onClick={() => toggleDomain(r.domain)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                    active
                      ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm text-ink-800">{r.domain}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-900">Pctl. {r.percentile}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${RANGE_BADGE_CLASS[r.range]}`}>
                      {RANGE_LABEL[r.range]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* interpretación del dominio activo */}
        {activeDomain && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="text-sm font-semibold text-ink-900">{activeDomain}</div>
            {(() => {
              const it = editedContent?.interpretacionPorDominio.find((x) => x.dominio === activeDomain);
              return it ? (
                <p className="mt-1 text-sm text-slate-600">{it.interpretacion}</p>
              ) : (
                <p className="mt-1 text-sm text-slate-400">
                  Genera el informe para ver la interpretación de este dominio.
                </p>
              );
            })()}
          </div>
        )}

        {/* perfil en barras (mismo dato del PDF) */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Perfil en barras
          </h3>
          <AssessmentChart results={patient.results} />
        </div>
      </div>

      {/* Generación / informe */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink-900">Informe asistido por IA</h2>
          <div className="flex items-center gap-2">
            {report?.source && (
              <span className="text-xs text-slate-400">
                Origen: {report.source === "ia" ? "IA en línea" : "asistente local (fallback)"}
              </span>
            )}
            {!report ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:bg-slate-300"
              >
                {generating ? "Generando…" : "Generar informe asistido por IA"}
              </button>
            ) : (
              !validated && (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {generating ? "Regenerando…" : "Regenerar"}
                </button>
              )
            )}
          </div>
        </div>

        {!report ? (
          <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            <p>Aún no se ha generado el informe para este paciente.</p>
            <p className="mt-1 text-xs">
              No se enviarán nombres ni datos identificables al modelo, solo el código y los puntajes.
            </p>
          </div>
        ) : (
          <>
            {validated && (
              <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
                Informe validado por {report.validatedBy} ·{" "}
                {report.validatedAt && new Date(report.validatedAt).toLocaleString("es-CO")}. Versión final.
              </div>
            )}
            {editedContent && (
              <ReportEditor
                content={editedContent}
                readOnly={validated}
                onChange={(next) => updateEdited(patient.id, next)}
              />
            )}

            {/* Acciones */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
              {!validated ? (
                <>
                  <span className="mr-auto text-xs text-slate-400">
                    El informe final requiere validación profesional.
                  </span>
                  <button
                    onClick={() => validate(patient.id, validatedBy)}
                    className="inline-flex items-center rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800"
                  >
                    Validar informe y preparar PDF
                  </button>
                </>
              ) : (
                <PdfDownloadButton patient={patient} report={report} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-ink-800">{value}</div>
    </div>
  );
}
