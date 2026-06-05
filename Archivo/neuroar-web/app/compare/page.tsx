import Link from 'next/link';
import { reports } from '@/lib/reports';
import { DOMAIN_ORDER, DOMAIN_META } from '@/lib/domains';
import { rangeColor } from '@/lib/reports';
import { MiniRadar } from '@/components/reports/MiniRadar';
import { TopNav } from '@/components/TopNav';
import { Chip } from '@/components/ui/Chip';
import { ArrowLeft } from 'lucide-react';

export default function ComparePage() {
  return (
    <>
      <TopNav />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <Link href="/reports" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <Chip className="mb-4">Vista comparativa · modo profesional</Chip>
        <h1 className="display text-4xl md:text-6xl text-balance max-w-3xl">
          Comparar perfiles<br />
          <span className="text-shimmer">cognitivos.</span>
        </h1>

        {/* Radares */}
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {reports.map((r) => (
            <div key={r.id} className="glass p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-xs text-ink-faint">{r.code}</p>
                <p className="text-xs text-ink-dim">{r.age} años</p>
              </div>
              <div className="flex justify-center">
                <MiniRadar domains={r.domains} size={220} />
              </div>
              <p className="text-xs text-ink-dim mt-3 text-center">{r.context}</p>
            </div>
          ))}
        </div>

        {/* Delta table */}
        <div className="glass mt-10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] border-b border-line">
              <tr>
                <th className="text-left px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  Dominio
                </th>
                {reports.map((r) => (
                  <th
                    key={r.id}
                    className="text-right px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint"
                  >
                    {r.code.replace('NA-2026-', '#')}
                  </th>
                ))}
                <th className="text-right px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody>
              {DOMAIN_ORDER.map((key) => {
                const values = reports.map((r) => r.domains.find((d) => d.key === key)!);
                const series = values.map((v) => v.percentile);
                return (
                  <tr key={key} className="border-b border-line/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-ink">{DOMAIN_META[key].label}</td>
                    {values.map((v, i) => (
                      <td key={i} className="px-6 py-4 text-right font-mono">
                        <span style={{ color: rangeColor(v.range) }}>{v.percentile}</span>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <Sparkline values={series} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const W = 90;
  const H = 24;
  const max = 100;
  const step = W / (values.length - 1);
  const pts = values
    .map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`)
    .join(' L ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="inline-block">
      <path d={`M ${pts}`} fill="none" stroke="#7AE7FF" strokeWidth={1.5} />
      {values.map((v, i) => (
        <circle key={i} cx={i * step} cy={H - (v / max) * H} r={2} fill="#7AE7FF" />
      ))}
    </svg>
  );
}
