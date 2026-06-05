import type { Patient, Report } from "../types/neuroar";

// Cliente HTTP tipado para los endpoints PHP del backend NeuroAr.
// Base URL se configura via VITE_API_BASE_URL (ej. https://informes.neuroar.com.co/api).
// En modo mock/demo, este cliente no se usa; el phpProvider lo invoca solo si está activo.

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" },
    credentials: "include", // envía cookie de sesión PHP si aplica
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Contratos de respuesta esperados del backend PHP.
// El equipo PHP debe respetar estas formas para que el frontend funcione.
// ---------------------------------------------------------------------------

export type ApiPatient = {
  id: string;
  code: string;
  age: number;
  institution: string;
  context: string;
  assessment_date: string;
  professional_name: string;
  professional_license?: string;
  results: Patient["results"];
};

export type ApiReport = {
  id: string;
  patient_id: string;
  status: "not_generated" | "draft" | "validated";
  source?: "ia" | "fallback";
  ai_content?: Report["aiContent"];
  edited_content?: Report["editedContent"];
  validated_by?: string;
  validated_at?: string;
};

// Mapeos frontend ↔ API

export function apiPatientToModel(r: ApiPatient): Patient {
  return {
    id: r.id,
    code: r.code,
    age: r.age,
    institution: r.institution,
    context: r.context,
    assessmentDate: r.assessment_date,
    professional: { name: r.professional_name, licenseNo: r.professional_license },
    results: r.results,
  };
}

export function apiReportToModel(r: ApiReport): Report {
  return {
    id: r.id,
    patientId: r.patient_id,
    status: r.status,
    source: r.source,
    aiContent: r.ai_content,
    editedContent: r.edited_content,
    validatedBy: r.validated_by,
    validatedAt: r.validated_at,
  };
}

// ---------------------------------------------------------------------------
// Endpoints (documentación viva — el PHP debe implementar estas rutas)
//
//  GET  /api/patients                     → ApiPatient[]
//  GET  /api/patients/:id                 → ApiPatient
//  GET  /api/reports?patient_id=:id       → ApiReport | null
//  POST /api/reports                      → ApiReport  (crea/actualiza)
//  PUT  /api/reports/:id/validate         → ApiReport  (cambia status a validated)
//  GET  /api/reports/:id/pdf              → blob PDF   (descarga directa)
// ---------------------------------------------------------------------------

export const phpApi = {
  async listPatients(): Promise<ApiPatient[]> {
    return get("/patients");
  },

  async getPatient(id: string): Promise<ApiPatient> {
    return get(`/patients/${id}`);
  },

  async getReportByPatient(patientId: string): Promise<ApiReport | null> {
    try {
      return await get<ApiReport>(`/reports?patient_id=${patientId}`);
    } catch {
      return null; // 404 = sin informe todavía
    }
  },

  async saveReport(report: Report): Promise<ApiReport> {
    return post<ApiReport>("/reports", {
      id: report.id,
      patient_id: report.patientId,
      status: report.status,
      source: report.source ?? null,
      ai_content: report.aiContent ?? null,
      edited_content: report.editedContent ?? null,
      validated_by: report.validatedBy ?? null,
      validated_at: report.validatedAt ?? null,
    });
  },

  async validateReport(reportId: string, validatedBy: string): Promise<ApiReport> {
    return put<ApiReport>(`/reports/${reportId}/validate`, { validated_by: validatedBy });
  },
};
