import type { ReportStatus } from "../types/neuroar";

const CONFIG: Record<ReportStatus, { label: string; className: string }> = {
  not_generated: {
    label: "Sin generar",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
  draft: {
    label: "Borrador asistido por IA",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  validated: {
    label: "Validado por profesional",
    className: "bg-green-50 text-green-700 ring-1 ring-green-200",
  },
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
