import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { CognitiveDomainResult } from "../types/neuroar";
import { RANGE_COLOR } from "../lib/rangeUtils";

// Gráfico de barras de percentiles por dominio (vista web). Líneas de referencia en 25 y 70.
export function AssessmentChart({ results }: { results: CognitiveDomainResult[] }) {
  const data = results.map((r) => ({
    domain: r.domain,
    percentil: r.percentile,
    color: RANGE_COLOR[r.range],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
          <XAxis
            dataKey="domain"
            tick={{ fontSize: 11, fill: "#475569" }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#475569" }} />
          <Tooltip
            formatter={(v: number) => [`Percentil ${v}`, ""]}
            cursor={{ fill: "rgba(37,99,235,0.06)" }}
          />
          <ReferenceLine y={25} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine y={70} stroke="#cbd5e1" strokeDasharray="4 4" />
          <Bar dataKey="percentil" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
