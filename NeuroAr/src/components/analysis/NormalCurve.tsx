import {
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CognitiveDomainResult } from "../../types/neuroar";
import { normalPdf, percentileToZ } from "../../lib/stats";
import { RANGE_COLOR } from "../../lib/rangeUtils";

// Curva de distribución normal: ubica cada dominio según su percentil sobre la campana.
// Comunica de forma intuitiva "qué tan típico" es cada desempeño respecto a la población.
export function NormalCurve({ results }: { results: CognitiveDomainResult[] }) {
  const curve = [];
  for (let x = -3.2; x <= 3.2; x += 0.1) {
    curve.push({ x: Number(x.toFixed(2)), y: normalPdf(x) });
  }

  // Evita solapes verticales: pequeño escalonado cuando dos dominios caen cerca.
  const dots = results
    .map((r) => ({ r, z: percentileToZ(r.percentile) }))
    .sort((a, b) => a.z - b.z)
    .map((d, i) => ({ ...d, y: normalPdf(d.z) + (i % 2 === 0 ? 0 : 0.012) }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={curve} margin={{ top: 16, right: 12, left: -8, bottom: 4 }}>
          <defs>
            <linearGradient id="bell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1e293b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {/* Bandas: bajo (<-0.67z ≈ pctl 25) / esperado / destacado (>0.52z ≈ pctl 70) */}
          <ReferenceArea x1={-3.2} x2={-0.674} fill="#f87171" fillOpacity={0.06} />
          <ReferenceArea x1={0.524} x2={3.2} fill="#34d399" fillOpacity={0.06} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-3.2, 3.2]}
            ticks={[-2, -1, 0, 1, 2]}
            tickFormatter={(z) => `${z > 0 ? "+" : ""}${z}σ`}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <YAxis hide domain={[0, 0.46]} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            formatter={() => ["", ""]}
            labelFormatter={(z: number) => `${z}σ`}
          />
          <Area type="monotone" dataKey="y" stroke="#38bdf8" strokeWidth={2} fill="url(#bell)" />
          {dots.map((d) => (
            <ReferenceDot
              key={d.r.domain}
              x={d.z}
              y={d.y}
              r={5}
              fill={RANGE_COLOR[d.r.range]}
              stroke="#0f172a"
              strokeWidth={1.5}
              label={{
                value: d.r.domain.split(" ")[0],
                position: "top",
                fill: "#cbd5e1",
                fontSize: 10,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
