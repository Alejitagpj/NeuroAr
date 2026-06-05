import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { ReportStatusBadge } from "../components/ReportStatusBadge";
import type { ReportStatus } from "../types/neuroar";

export function Dashboard() {
  const { patients, getReport, loading } = useStore();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Panel de informes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pacientes anonimizados. Genere, valide y descargue informes neuropsicológicos asistidos por IA.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando pacientes…</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Código</th>
                <th className="px-5 py-3 font-semibold">Edad</th>
                <th className="px-5 py-3 font-semibold">Institución</th>
                <th className="px-5 py-3 font-semibold">Evaluación</th>
                <th className="px-5 py-3 font-semibold">Estado del informe</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => {
                const status: ReportStatus = getReport(p.id)?.status ?? "not_generated";
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-ink-900">{p.code}</td>
                    <td className="px-5 py-3 text-slate-600">{p.age} años</td>
                    <td className="px-5 py-3 text-slate-600">{p.institution}</td>
                    <td className="px-5 py-3 text-slate-600">{p.assessmentDate}</td>
                    <td className="px-5 py-3">
                      <ReportStatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/app/paciente/${p.id}`}
                        className="inline-flex items-center rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                      >
                        Abrir paciente
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
