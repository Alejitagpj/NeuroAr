import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DomainRange, Patient, Report } from "../types/neuroar";
import { BrainCanvas } from "./BrainCanvas";
import { PdfDownloadButton } from "./PdfDownloadButton";

// Traducción "humana" de los rangos: sin percentiles ni jerga técnica.
const FRIENDLY: Record<DomainRange, { label: string; icon: string; tone: string }> = {
  destacado: { label: "Fortaleza", icon: "🌟", tone: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30" },
  esperado: { label: "En lo esperado", icon: "✅", tone: "bg-sky-500/15 text-sky-200 ring-sky-400/30" },
  bajo: { label: "A reforzar", icon: "🌱", tone: "bg-amber-500/15 text-amber-200 ring-amber-400/30" },
};

const DOMAIN_PLAIN: Record<string, string> = {
  "Atención": "Prestar atención",
  "Memoria": "Recordar cosas",
  "Funciones ejecutivas": "Organizarse y planear",
  "Lenguaje": "Lenguaje y palabras",
  "Velocidad de procesamiento": "Pensar con agilidad",
  "Habilidades visuoespaciales": "Orientarse en el espacio",
};

export function FamilyView({ patient, report }: { patient: Patient; report?: Report }) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const validated = report?.status === "validated";
  const resumen = report?.editedContent?.resumenParaPadres ?? report?.aiContent?.resumenParaPadres;

  const ranges = useMemo<Record<string, DomainRange>>(
    () => Object.fromEntries(patient.results.map((r) => [r.domain, r.range])),
    [patient]
  );
  const intensities = useMemo<Record<string, number>>(
    () => Object.fromEntries(patient.results.map((r) => [r.domain, r.percentile / 100])),
    [patient]
  );

  const fortalezas = patient.results.filter((r) => r.range === "destacado");
  const aReforzar = patient.results.filter((r) => r.range === "bajo");

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-slate-100 shadow-2xl ring-1 ring-white/10">
      {/* Hero cálido */}
      <div className="relative px-6 pt-8 sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Resumen para la familia
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
          Cómo le fue en sus habilidades de pensamiento
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Esta es una mirada cercana, sin tecnicismos. Recuerden: es una foto de un momento y no
          define las capacidades ni el futuro. {patient.professional.name} acompañará cada paso.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-2">
        {/* Cerebro interactivo */}
        <div>
          <div className="relative h-[300px] overflow-hidden rounded-2xl bg-slate-950/60 ring-1 ring-white/10 sm:h-[340px]">
            <BrainCanvas
              className="h-full w-full"
              interactive
              ranges={ranges}
              intensities={intensities}
              activeDomain={activeDomain}
              onRegionClick={(d) => setActiveDomain((c) => (c === d ? null : d))}
            />
            <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 text-[11px]">
              <Legend icon="🌟" text="Fortaleza" />
              <Legend icon="✅" text="En lo esperado" />
              <Legend icon="🌱" text="A reforzar" />
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Toca una zona del cerebro para ver a qué habilidad corresponde.
          </p>
        </div>

        {/* Habilidades en lenguaje claro */}
        <div className="grid content-start gap-2">
          {patient.results.map((r) => {
            const f = FRIENDLY[r.range];
            const active = activeDomain === r.domain;
            return (
              <button
                key={r.domain}
                onClick={() => setActiveDomain((c) => (c === r.domain ? null : r.domain))}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition ring-1 ${
                  active ? "bg-white/10 ring-white/25" : "bg-white/5 ring-white/10 hover:bg-white/10"
                }`}
              >
                <span className="text-sm font-medium text-slate-100">
                  {DOMAIN_PLAIN[r.domain] ?? r.domain}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${f.tone}`}>
                  <span aria-hidden>{f.icon}</span> {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fortalezas / a reforzar */}
      <div className="grid gap-4 px-6 pb-2 sm:grid-cols-2 sm:px-10">
        <HighlightCard
          title="Lo que más le brilla"
          icon="🌟"
          items={fortalezas.map((r) => DOMAIN_PLAIN[r.domain] ?? r.domain)}
          empty="Su desempeño se ubica en lo esperado en general."
          tone="from-emerald-500/10"
        />
        <HighlightCard
          title="Dónde podemos acompañar más"
          icon="🌱"
          items={aReforzar.map((r) => DOMAIN_PLAIN[r.domain] ?? r.domain)}
          empty="No se identificaron áreas que requieran refuerzo especial."
          tone="from-amber-500/10"
        />
      </div>

      {/* Progreso amable (si hay seguimiento) */}
      {patient.longitudinal && (
        <div className="px-6 pb-2 pt-4 sm:px-10">
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold text-white">Cómo fue mejorando con la práctica</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Cada intento sumó: empezó con algunos errores y terminó completándolo.
            </p>
            <div className="mt-3 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={patient.longitudinal.attempts.map((a) => ({ intento: `#${a.intento}`, logros: a.aciertos }))}
                  margin={{ top: 6, right: 12, left: -22, bottom: 0 }}
                >
                  <XAxis dataKey="intento" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, patient.longitudinal.maxScore]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 10, color: "#e2e8f0", fontSize: 12 }}
                    formatter={(v: number) => [`${v} logros`, ""]}
                  />
                  <Line type="monotone" dataKey="logros" stroke="#fbbf24" strokeWidth={3} dot={{ r: 3, fill: "#fbbf24" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Resumen narrativo */}
      <div className="px-6 py-6 sm:px-10">
        {resumen ? (
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h3 className="mb-2 text-sm font-semibold text-white">En palabras sencillas</h3>
            <p className="text-[15px] leading-relaxed text-slate-200">{resumen}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-slate-300 ring-1 ring-white/10">
            Su profesional está preparando el informe. Pronto encontrarán aquí el resumen.
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            La IA propone, el profesional valida. Este documento es de apoyo y no constituye un diagnóstico.
          </p>
          {validated && report && <PdfDownloadButton patient={patient} report={report} />}
        </div>
      </div>
    </div>
  );
}

function Legend({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-1 text-slate-200 ring-1 ring-white/10">
      <span aria-hidden>{icon}</span> {text}
    </span>
  );
}

function HighlightCard({
  title,
  icon,
  items,
  empty,
  tone,
}: {
  title: string;
  icon: string;
  items: string[];
  empty: string;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-b ${tone} to-transparent p-5 ring-1 ring-white/10`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
        <span aria-hidden>{icon}</span> {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {items.map((it) => (
            <li key={it} className="text-sm text-slate-200">• {it}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">{empty}</p>
      )}
    </div>
  );
}
