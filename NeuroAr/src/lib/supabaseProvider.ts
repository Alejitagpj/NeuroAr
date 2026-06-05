import type { Patient } from "../types/neuroar";
import type { DataProvider } from "./dataProvider";
import { getSupabase } from "./supabaseClient";

// Implementación Supabase. Mapea las filas de Postgres (con RLS por institución) a los
// tipos del dominio. Si Supabase no está configurado, los métodos lanzan y el selector
// de proveedor habrá elegido mock en su lugar.
function client() {
  const c = getSupabase();
  if (!c) throw new Error("Supabase no está configurado (revisa VITE_SUPABASE_URL/ANON_KEY).");
  return c;
}

type PatientRow = {
  id: string;
  code: string;
  age: number;
  institution: string;
  context: string;
  assessment_date: string;
  professional_name: string;
  professional_license: string | null;
  results: Patient["results"];
};

function rowToPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    code: row.code,
    age: row.age,
    institution: row.institution,
    context: row.context,
    assessmentDate: row.assessment_date,
    professional: { name: row.professional_name, licenseNo: row.professional_license ?? undefined },
    results: row.results,
  };
}

export const supabaseProvider: DataProvider = {
  kind: "supabase",

  async listPatients() {
    const { data, error } = await client()
      .from("patients_view")
      .select("*")
      .order("code");
    if (error) throw error;
    return (data as PatientRow[]).map(rowToPatient);
  },

  async getPatient(id) {
    const { data, error } = await client()
      .from("patients_view")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToPatient(data as PatientRow) : undefined;
  },

  async getReportByPatient(patientId) {
    const { data, error } = await client()
      .from("reports")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    return {
      id: data.id,
      patientId: data.patient_id,
      status: data.status,
      aiContent: data.ai_content ?? undefined,
      editedContent: data.edited_content ?? undefined,
      source: data.source ?? undefined,
      validatedBy: data.validated_by ?? undefined,
      validatedAt: data.validated_at ?? undefined,
    };
  },

  async saveReport(report) {
    const { data, error } = await client()
      .from("reports")
      .upsert(
        {
          id: report.id,
          patient_id: report.patientId,
          status: report.status,
          ai_content: report.aiContent ?? null,
          edited_content: report.editedContent ?? null,
          source: report.source ?? null,
          validated_by: report.validatedBy ?? null,
          validated_at: report.validatedAt ?? null,
        },
        { onConflict: "patient_id" }
      )
      .select()
      .single();
    if (error) throw error;
    return { ...report, id: data.id };
  },
};
