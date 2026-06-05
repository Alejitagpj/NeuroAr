import type { Patient, Report } from "../types/neuroar";

// Contrato de acceso a datos. Tres implementaciones intercambiables:
//   - mockProvider   (en memoria, demo infalible — por defecto)
//   - phpProvider    (backend PHP/MySQL de NeuroAr en Hostinger — producción)
//   - supabaseProvider (alternativa cloud si se decide migrar)
// Se selecciona por VITE_DATA_PROVIDER. Si el backend falla, cambiar a "mock".
export interface DataProvider {
  readonly kind: "mock" | "supabase";
  listPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  getReportByPatient(patientId: string): Promise<Report | undefined>;
  saveReport(report: Report): Promise<Report>;
}

import { mockProvider } from "./mockProvider";
import { supabaseProvider } from "./supabaseProvider";
import { phpProvider } from "./phpProvider";
import { hasSupabaseConfig } from "./supabaseClient";

const hasPhpConfig = Boolean(import.meta.env.VITE_API_BASE_URL as string | undefined);

function selectProvider(): DataProvider {
  const choice = (import.meta.env.VITE_DATA_PROVIDER as string | undefined)?.toLowerCase();
  if (choice === "php" && hasPhpConfig) return phpProvider;
  if (choice === "supabase" && hasSupabaseConfig) return supabaseProvider;
  return mockProvider; // fallback siempre disponible
}

export const dataProvider: DataProvider = selectProvider();
