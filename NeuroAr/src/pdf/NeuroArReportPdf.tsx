import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Patient, Report, ReportContent } from "../types/neuroar";

// Documento PDF institucional y sobrio. Gráfico de barras dibujado con primitivas
// (View) para máxima fiabilidad — sin dependencias de gráficos que puedan romper.

Font.registerHyphenationCallback((word) => [word]); // evita cortes raros de palabras

const COLORS = {
  brand: "#1d4ed8",
  ink: "#1e293b",
  sub: "#475569",
  line: "#e2e8f0",
  bajo: "#dc2626",
  esperado: "#2563eb",
  destacado: "#16a34a",
};

const RANGE_COLOR: Record<string, string> = {
  bajo: COLORS.bajo,
  esperado: COLORS.esperado,
  destacado: COLORS.destacado,
};

const RANGE_LABEL: Record<string, string> = {
  bajo: "Bajo",
  esperado: "Esperado",
  destacado: "Destacado",
};

const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 56, paddingHorizontal: 44, fontSize: 10, color: COLORS.ink, lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: COLORS.brand, paddingBottom: 10, marginBottom: 14 },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoBox: { width: 26, height: 26, borderRadius: 5, backgroundColor: COLORS.brand, color: "#fff", textAlign: "center", paddingTop: 6, fontSize: 13, marginRight: 8 },
  brandTitle: { fontSize: 13, fontWeight: 700, color: COLORS.ink },
  brandSub: { fontSize: 8, color: COLORS.sub },
  metaBox: { textAlign: "right", fontSize: 8, color: COLORS.sub },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: COLORS.brand, marginTop: 14, marginBottom: 6 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: "#f8fafc", borderRadius: 6, padding: 10, marginBottom: 4 },
  infoItem: { width: "33.33%", marginBottom: 6 },
  infoLabel: { fontSize: 7.5, color: COLORS.sub, textTransform: "uppercase", letterSpacing: 0.4 },
  infoValue: { fontSize: 10, color: COLORS.ink },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingBottom: 4, marginBottom: 2 },
  th: { fontSize: 8, color: COLORS.sub, fontWeight: 700, textTransform: "uppercase" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#f1f5f9" },
  cDomain: { width: "32%" },
  cBar: { width: "44%", paddingRight: 8 },
  cScore: { width: "12%", textAlign: "right" },
  cRange: { width: "12%", textAlign: "right" },
  barTrack: { height: 8, backgroundColor: "#eef2f7", borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  domainBlock: { marginBottom: 8 },
  domainName: { fontSize: 10, fontWeight: 700, color: COLORS.ink },
  evidence: { fontSize: 8.5, color: COLORS.sub, fontStyle: "italic" },
  recCat: { fontSize: 9.5, fontWeight: 700, color: COLORS.ink, marginTop: 6 },
  parentsBox: { backgroundColor: "#eef5ff", borderRadius: 6, padding: 10 },
  limitBox: { backgroundColor: "#f8fafc", borderRadius: 6, padding: 10 },
  disclaimer: { marginTop: 12, borderWidth: 1, borderColor: "#fde68a", backgroundColor: "#fffbeb", borderRadius: 6, padding: 10, fontSize: 8.5, color: "#92400e" },
  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
  signBox: { width: "45%", borderTopWidth: 1, borderTopColor: COLORS.ink, paddingTop: 4 },
  footer: { position: "absolute", bottom: 24, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: COLORS.line, paddingTop: 6, fontSize: 7.5, color: COLORS.sub },
});

const CATEGORY_LABEL: Record<string, string> = {
  familia: "Para la familia",
  institucion: "Para la institución",
  profesional: "Para el profesional",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

export function NeuroArReportPdf({
  patient,
  report,
}: {
  patient: Patient;
  report: Report;
}) {
  const content: ReportContent =
    report.editedContent ?? report.aiContent ?? {
      interpretacionPorDominio: [],
      recomendaciones: [],
      resumenParaPadres: "",
      limitaciones: "",
    };

  const recsByCat = (cat: string) =>
    content.recomendaciones.filter((r) => r.categoria === cat);

  return (
    <Document title={`Informe ${patient.code}`} author="NeuroAr Informes Inteligentes">
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header} fixed>
          <View style={styles.logoRow}>
            <Text style={styles.logoBox}>N</Text>
            <View>
              <Text style={styles.brandTitle}>NeuroAr Informes Inteligentes</Text>
              <Text style={styles.brandSub}>Informe neuropsicológico de apoyo asistido por IA</Text>
            </View>
          </View>
          <View style={styles.metaBox}>
            <Text>Código de paciente: {patient.code}</Text>
            <Text>Estado: {report.status === "validated" ? "Validado" : "Borrador"}</Text>
          </View>
        </View>

        {/* Datos del paciente / contexto */}
        <Text style={styles.sectionTitle}>Datos del informe</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Código de paciente</Text>
            <Text style={styles.infoValue}>{patient.code}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Edad</Text>
            <Text style={styles.infoValue}>{patient.age} años</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fecha de evaluación</Text>
            <Text style={styles.infoValue}>{formatDate(patient.assessmentDate)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Institución</Text>
            <Text style={styles.infoValue}>{patient.institution}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Profesional responsable</Text>
            <Text style={styles.infoValue}>{patient.professional.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>N° de licencia</Text>
            <Text style={styles.infoValue}>{patient.professional.licenseNo ?? "—"}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 9, color: COLORS.sub }}>
          Motivo / contexto: {patient.context}
        </Text>

        {/* Resultados por dominio */}
        <Text style={styles.sectionTitle}>Resultados por dominio cognitivo</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.cDomain]}>Dominio</Text>
          <Text style={[styles.th, styles.cBar]}>Percentil</Text>
          <Text style={[styles.th, styles.cScore]}>Pctl.</Text>
          <Text style={[styles.th, styles.cRange]}>Rango</Text>
        </View>
        {patient.results.map((r) => (
          <View style={styles.row} key={r.domain}>
            <Text style={styles.cDomain}>{r.domain}</Text>
            <View style={styles.cBar}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${r.percentile}%`, backgroundColor: RANGE_COLOR[r.range] },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.cScore}>{r.percentile}</Text>
            <Text style={[styles.cRange, { color: RANGE_COLOR[r.range] }]}>
              {RANGE_LABEL[r.range]}
            </Text>
          </View>
        ))}

        {/* Interpretación por dominio */}
        <Text style={styles.sectionTitle}>Interpretación clínica por dominio</Text>
        {content.interpretacionPorDominio.map((d, i) => (
          <View style={styles.domainBlock} key={i} wrap={false}>
            <Text style={styles.domainName}>{d.dominio}</Text>
            <Text>{d.interpretacion}</Text>
            {d.evidencia ? <Text style={styles.evidence}>Evidencia: {d.evidencia}</Text> : null}
          </View>
        ))}

        {/* Recomendaciones */}
        <Text style={styles.sectionTitle}>Recomendaciones</Text>
        {(["familia", "institucion", "profesional"] as const).map((cat) => {
          const recs = recsByCat(cat);
          if (recs.length === 0) return null;
          return (
            <View key={cat} wrap={false}>
              <Text style={styles.recCat}>{CATEGORY_LABEL[cat]}</Text>
              {recs.map((r, i) => (
                <Text key={i}>• {r.recomendacion}</Text>
              ))}
            </View>
          );
        })}

        {/* Resumen para padres */}
        <Text style={styles.sectionTitle}>Resumen para padres / tutores</Text>
        <View style={styles.parentsBox}>
          <Text>{content.resumenParaPadres}</Text>
        </View>

        {/* Limitaciones */}
        <Text style={styles.sectionTitle}>Limitaciones</Text>
        <View style={styles.limitBox}>
          <Text>{content.limitaciones}</Text>
        </View>

        {/* Disclaimer obligatorio */}
        <View style={styles.disclaimer}>
          <Text>
            Documento de apoyo generado con asistencia de IA. Requiere revisión y validación de un
            profesional autorizado. No constituye diagnóstico autónomo ni reemplaza el criterio clínico.
          </Text>
        </View>

        {/* Firma */}
        <View style={styles.signRow}>
          <View style={styles.signBox}>
            <Text style={{ fontWeight: 700 }}>{patient.professional.name}</Text>
            <Text style={{ fontSize: 8, color: COLORS.sub }}>
              N° de licencia: {patient.professional.licenseNo ?? "—"}
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.sub }}>Profesional responsable</Text>
          </View>
          <View style={styles.signBox}>
            <Text style={{ fontWeight: 700 }}>Validación</Text>
            <Text style={{ fontSize: 8, color: COLORS.sub }}>
              {report.status === "validated"
                ? `Validado el ${formatDate(report.validatedAt)}`
                : "Pendiente de validación"}
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.sub }}>
              {report.validatedBy ? `Por: ${report.validatedBy}` : ""}
            </Text>
          </View>
        </View>

        {/* Pie con paginación */}
        <View style={styles.footer} fixed>
          <Text>NeuroAr Informes Inteligentes · {patient.code}</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
