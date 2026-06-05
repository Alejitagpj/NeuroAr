// Corre el flujo real end-to-end por cada paciente demo y escribe el PDF a /out.
import { build } from "esbuild";
import { writeFileSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const entry = `
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEMO_PATIENTS } from "../src/data/demoData.ts";
import { generateFallbackReport } from "../src/lib/reportGenerator.ts";
import { NeuroArReportPdf } from "../src/pdf/NeuroArReportPdf.tsx";

const outDir = join(process.cwd(), "out");
for (const patient of DEMO_PATIENTS) {
  const content = generateFallbackReport(patient);
  const report = {
    id: "r-" + patient.id, patientId: patient.id, status: "validated",
    aiContent: content, editedContent: content, source: "fallback",
    validatedBy: patient.professional.name, validatedAt: new Date().toISOString(),
  };
  const buf = await renderToBuffer(React.createElement(NeuroArReportPdf, { patient, report }));
  const file = join(outDir, "Informe_" + patient.code + ".pdf");
  writeFileSync(file, buf);
  console.log("PDF " + patient.code + " -> " + buf.length + " bytes");
}
`;

mkdirSync(join(process.cwd(), "out"), { recursive: true });
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
    banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
    logLevel: "error",
  });
  await import("./_bundle.mjs");
} finally {
  rmSync(entryFile, { force: true });
  rmSync(out, { force: true });
}
