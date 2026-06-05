// Verificación headless del pipeline de PDF: genera el informe fallback de un paciente
// demo y renderiza el PDF a un buffer. Falla si algo del documento react-pdf rompe.
import { build } from "esbuild";
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const entry = `
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { DEMO_PATIENTS } from "../src/data/demoData.ts";
import { generateFallbackReport } from "../src/lib/reportGenerator.ts";
import { NeuroArReportPdf } from "../src/pdf/NeuroArReportPdf.tsx";

const patient = DEMO_PATIENTS[0];
const content = generateFallbackReport(patient);
const report = { id: "t", patientId: patient.id, status: "validated", aiContent: content, editedContent: content, source: "fallback", validatedBy: patient.professional.name, validatedAt: new Date().toISOString() };
const buf = await renderToBuffer(React.createElement(NeuroArReportPdf, { patient, report }));
if (!buf || buf.length < 1000) throw new Error("PDF buffer demasiado pequeño: " + (buf && buf.length));
console.log("OK PDF bytes=" + buf.length + " interpretaciones=" + content.interpretacionPorDominio.length + " recomendaciones=" + content.recomendaciones.length);
`;

const entryFile = join(process.cwd(), "scripts", "_entry.mjs");
const out = join(process.cwd(), "scripts", "_bundle.mjs");
writeFileSync(entryFile, entry);

try {
  await build({
    entryPoints: [entryFile],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    jsx: "automatic",
    loader: { ".ts": "ts", ".tsx": "tsx" },
    banner: {
      js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);",
    },
    logLevel: "error",
  });
  await import("./_bundle.mjs");
} finally {
  rmSync(entryFile, { force: true });
  rmSync(out, { force: true });
}
