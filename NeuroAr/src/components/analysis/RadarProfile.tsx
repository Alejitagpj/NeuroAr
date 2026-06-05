import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CognitiveDomainResult } from "../../types/neuroar";

// Perfil multidominio en radar: lectura global de fortalezas/áreas de apoyo de un vistazo.
export function RadarProfile({ results }: { results: CognitiveDomainResult[] }) {
  const data = results.map((r) => ({
    dominio: r.domain.replace("Habilidades ", "").replace("Velocidad de ", "Vel. "),
    percentil: r.percentile,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
            </radialGradient>
          </defs>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="dominio" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            tickCount={5}
            tick={{ fill: "#64748b", fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            dataKey="percentil"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#radarFill)"
            dot={{ r: 3, fill: "#7dd3fc" }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            formatter={(v: number) => [`Percentil ${v}`, ""]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
