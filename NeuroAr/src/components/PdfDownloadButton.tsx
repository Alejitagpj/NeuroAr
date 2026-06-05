import { useState } from "react";
import type { Patient, Report } from "../types/neuroar";

export function PdfDownloadButton({
  patient,
  report,
  disabled,
}: {
  patient: Patient;
  report?: Report;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    if (!report) return;
    setBusy(true);
    try {
      // Load heavy PDF renderer only on demand (keeps initial bundle small).
      const [{ pdf }, { NeuroArReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../pdf/NeuroArReportPdf"),
      ]);
      const { createElement } = await import("react");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(createElement(NeuroArReportPdf, { patient, report }) as any).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Informe_${patient.code}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || busy || !report}
      className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {busy ? "Generando PDF…" : "Descargar PDF"}
    </button>
  );
}
