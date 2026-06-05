import type { Report } from "../types/neuroar";
import type { DataProvider } from "./dataProvider";
import { phpApi, apiPatientToModel, apiReportToModel } from "./phpApiClient";

// Implementación que conecta con el backend PHP/MySQL de NeuroAr en Hostinger.
// Activa con: VITE_DATA_PROVIDER=php y VITE_API_BASE_URL=https://informes.neuroar.com.co/api
export const phpProvider: DataProvider = {
  kind: "supabase" as const, // reutilizamos el label para el badge; se puede ampliar

  async listPatients() {
    const rows = await phpApi.listPatients();
    return rows.map(apiPatientToModel);
  },

  async getPatient(id) {
    try {
      return apiPatientToModel(await phpApi.getPatient(id));
    } catch {
      return undefined;
    }
  },

  async getReportByPatient(patientId) {
    const row = await phpApi.getReportByPatient(patientId);
    if (!row) return undefined;
    return apiReportToModel(row);
  },

  async saveReport(report: Report) {
    const row = await phpApi.saveReport(report);
    return apiReportToModel(row);
  },
};
