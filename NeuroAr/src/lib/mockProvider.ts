import type { Report } from "../types/neuroar";
import { DEMO_PATIENTS } from "../data/demoData";
import type { DataProvider } from "./dataProvider";

// Implementación en memoria. Los informes se mantienen durante la sesión del navegador.
const reports = new Map<string, Report>();

export const mockProvider: DataProvider = {
  kind: "mock",

  async listPatients() {
    return DEMO_PATIENTS;
  },

  async getPatient(id) {
    return DEMO_PATIENTS.find((p) => p.id === id);
  },

  async getReportByPatient(patientId) {
    return reports.get(patientId);
  },

  async saveReport(report) {
    reports.set(report.patientId, report);
    return report;
  },
};
