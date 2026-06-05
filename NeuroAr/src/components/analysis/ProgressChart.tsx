import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LongitudinalSeries } from "../../types/neuroar";
import { mean, trendSlope } from "../../lib/stats";

// Seguimiento longitudinal: aciertos por intento, con línea de tendencia y promedio.
// Hace visible el "efecto práctica" y la variabilidad entre ensayos.
export function ProgressChart({ series }: { series: LongitudinalSeries }) {
  const data = series.attempts.map((a) => ({
    intento: `#${a.intento}`,
    aciertos: a.aciertos,
    errores: a.errores,
  }));

  const aciertos = series.attempts.map((a) => a.aciertos);
  const avg = mean(aciertos);
  const slope = trendSlope(aciertos);
  const mejora = aciertos[aciertos.length - 1] - aciertos[0];

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-medium text-emerald-300 ring-1 ring-emerald-500/30">
          Mejora total: {mejora >= 0 ? "+" : ""}{mejora} {series.unit}
        </span>
        <span className="rounded-full bg-sky-500/15 px-2.5 py-1 font-medium text-sky-300 ring-1 ring-sky-500/30">
          Tendencia: {slope > 0.05 ? "ascendente ↗" : slope < -0.05 ? "descendente ↘" : "estable →"}
        </span>
        <span className="rounded-full bg-slate-500/15 px-2.5 py-1 font-medium text-slate-300 ring-1 ring-slate-500/30">
          Promedio: {avg.toFixed(1)} / {series.maxScore}
        </span>
      </div>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="intento" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis domain={[0, series.maxScore]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                color: "#e2e8f0",
                fontSize: 12,
              }}
            />
            <ReferenceLine y={avg} stroke="#475569" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="aciertos"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#34d399" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="errores"
              stroke="#f87171"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={{ r: 2, fill: "#f87171" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500">{series.label}</p>
    </div>
  );
}
