import { useEffect, useState } from "react";
import type { ReportContent } from "../types/neuroar";

const CATEGORY_LABEL: Record<string, string> = {
  familia: "Familia",
  institucion: "Institución",
  profesional: "Profesional",
};

// Editor del contenido del informe. El profesional revisa y modifica antes de validar.
export function ReportEditor({
  content,
  readOnly,
  onChange,
}: {
  content: ReportContent;
  readOnly: boolean;
  onChange: (next: ReportContent) => void;
}) {
  const [draft, setDraft] = useState<ReportContent>(content);

  useEffect(() => setDraft(content), [content]);

  const update = (next: ReportContent) => {
    setDraft(next);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <p className="rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-700">
        La IA propone. El profesional valida. Revise y edite el contenido antes de validar el informe.
      </p>

      {/* Interpretación por dominio */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">Interpretación por dominio</h3>
        <div className="space-y-3">
          {draft.interpretacionPorDominio.map((d, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-1 text-sm font-medium text-ink-800">{d.dominio}</div>
              <textarea
                className="w-full resize-y rounded-md border border-slate-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50"
                rows={3}
                disabled={readOnly}
                value={d.interpretacion}
                onChange={(e) => {
                  const arr = [...draft.interpretacionPorDominio];
                  arr[i] = { ...arr[i], interpretacion: e.target.value };
                  update({ ...draft, interpretacionPorDominio: arr });
                }}
              />
              <p className="mt-1 text-xs italic text-slate-500">Evidencia: {d.evidencia}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">Recomendaciones</h3>
        <div className="space-y-3">
          {draft.recomendaciones.map((r, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {CATEGORY_LABEL[r.categoria] ?? r.categoria}
              </div>
              <textarea
                className="w-full resize-y rounded-md border border-slate-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50"
                rows={2}
                disabled={readOnly}
                value={r.recomendacion}
                onChange={(e) => {
                  const arr = [...draft.recomendaciones];
                  arr[i] = { ...arr[i], recomendacion: e.target.value };
                  update({ ...draft, recomendaciones: arr });
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Resumen para padres */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">Resumen para padres / tutores</h3>
        <textarea
          className="w-full resize-y rounded-md border border-slate-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50"
          rows={5}
          disabled={readOnly}
          value={draft.resumenParaPadres}
          onChange={(e) => update({ ...draft, resumenParaPadres: e.target.value })}
        />
      </section>

      {/* Limitaciones */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-ink-900">Limitaciones / notas</h3>
        <textarea
          className="w-full resize-y rounded-md border border-slate-200 p-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50"
          rows={4}
          disabled={readOnly}
          value={draft.limitaciones}
          onChange={(e) => update({ ...draft, limitaciones: e.target.value })}
        />
      </section>
    </div>
  );
}
