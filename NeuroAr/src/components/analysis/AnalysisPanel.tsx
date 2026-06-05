import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Patient } from "../../types/neuroar";
import { RANGE_COLOR } from "../../lib/rangeUtils";
import { mean } from "../../lib/stats";
import { RadarProfile } from "./RadarProfile";
import { NormalCurve } from "./NormalCurve";
import { ProgressChart } from "./ProgressChart";

type Tab = "perfil" | "distribucion" | "barras" | "progreso";

// Panel de análisis "premium": superficie oscura tipo laboratorio de datos dentro del
// marco clínico claro. Reúne KPIs + visualizaciones intercambiables.
export function AnalysisPanel({ patient }: { patient: Patient }) {
  const results = patient.results;
  const hasLongitudinal = Boolean(patient.longitudinal);
  const [tab, setTab] = useState<Tab>("perfil");

  const avg = Math.round(mean(results.map((r) => r.percentile)));
  const strongest = [...results].sort((a, b) => b.percentile - a.percentile)[0];
  const weakest = [...results].sort((a, b) => a.percentile - b.percentile)[0];
  const apoyo = results.filter((r) => r.range === "bajo").length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "perfil", label: "Perfil" },
    { id: "distribucion", label: "Distribución" },
    { id: "barras", label: "Barras" },
    ...(hasLongitudinal ? [{ id: "progreso" as Tab, label: "Progreso" }] : []),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 shadow-xl">
      {/* encabezado + KPIs */}
      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Análisis de datos</h3>
            <p className="text-xs text-slate-400">Lectura cuantitativa del perfil cognitivo</p>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 ring-1 ring-cyan-500/25">
            6 dominios
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Percentil medio" value={`${avg}`} accent="text-sky-300" />
          <Kpi label="Fortaleza" value={short(strongest.domain)} sub={`pctl ${strongest.percentile}`} accent="text-emerald-300" />
          <Kpi label="Mayor apoyo" value={short(weakest.domain)} sub={`pctl ${weakest.percentile}`} accent="text-amber-300" />
          <Kpi label="Áreas de apoyo" value={`${apoyo}`} sub={apoyo === 1 ? "dominio" : "dominios"} accent="text-rose-300" />
        </div>
      </div>

      {/* pestañas */}
      <div className="flex gap-1 border-b border-slate-800 px-3 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-3 py-2 text-xs font-medium transition ${
              tab === t.id
                ? "bg-slate-800/70 text-white ring-1 ring-inset ring-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* contenido */}
      <div className="p-5">
        {tab === "perfil" && <RadarProfile results={results} />}
        {tab === "distribucion" && <NormalCurve results={results} />}
        {tab === "barras" && <DarkBars patient={patient} />}
        {tab === "progreso" && patient.longitudinal && <ProgressChart series={patient.longitudinal} />}
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="rounded-xl bg-slate-800/40 px-3 py-2.5 ring-1 ring-slate-700/60">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-0.5 truncate text-lg font-semibold ${accent}`} title={value}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
    </div>
  );
}

function DarkBars({ patient }: { patient: Patient }) {
  const data = patient.results.map((r) => ({
    domain: short(r.domain),
    percentil: r.percentile,
    color: RANGE_COLOR[r.range],
  }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
          <XAxis dataKey="domain" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={0} angle={-12} textAnchor="end" height={50} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <Tooltip
            cursor={{ fill: "rgba(56,189,248,0.08)" }}
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            formatter={(v: number) => [`Percentil ${v}`, ""]}
          />
          <ReferenceLine y={25} stroke="#475569" strokeDasharray="4 4" />
          <ReferenceLine y={70} stroke="#475569" strokeDasharray="4 4" />
          <Bar dataKey="percentil" radius={[5, 5, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function short(domain: string): string {
  return domain.replace("Habilidades ", "").replace("Velocidad de ", "Vel. ");
}
