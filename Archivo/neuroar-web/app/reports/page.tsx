import Link from 'next/link';
import { reports } from '@/lib/reports';
import { ReportCard } from '@/components/reports/ReportCard';
import { TopNav } from '@/components/TopNav';
import { Chip } from '@/components/ui/Chip';

export default function ReportsPage() {
  return (
    <>
      <TopNav />
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <Chip className="mb-4">Paso 1 de 2</Chip>
            <h1 className="display text-4xl md:text-6xl text-balance max-w-2xl">
              Elige un informe<br />
              <span className="text-shimmer">para comenzar el recorrido.</span>
            </h1>
            <p className="mt-5 text-ink-dim max-w-xl">
              Cada card muestra el perfil cognitivo en mini-radar. Las áreas a fortalecer aparecen
              en coral, las destacadas en verde.
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-line-strong hover:border-cyan/40 transition-colors text-sm whitespace-nowrap"
          >
            Comparar los 3 →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {reports.map((r, i) => (
            <ReportCard key={r.id} report={r} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
