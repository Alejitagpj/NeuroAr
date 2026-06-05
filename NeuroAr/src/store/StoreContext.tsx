import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Patient, Report, ReportContent } from "../types/neuroar";
import { dataProvider } from "../lib/dataProvider";
import { generateReportContent } from "../lib/aiClient";

type StoreValue = {
  loading: boolean;
  providerKind: "mock" | "supabase";
  patients: Patient[];
  reports: Record<string, Report>; // por patientId
  getReport: (patientId: string) => Report | undefined;
  generate: (patient: Patient) => Promise<void>;
  updateEdited: (patientId: string, content: ReportContent) => Promise<void>;
  validate: (patientId: string, validatedBy: string) => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<Record<string, Report>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await dataProvider.listPatients();
      const entries = await Promise.all(
        list.map(async (p) => [p.id, await dataProvider.getReportByPatient(p.id)] as const)
      );
      if (!active) return;
      setPatients(list);
      const map: Record<string, Report> = {};
      for (const [id, r] of entries) if (r) map[id] = r;
      setReports(map);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (report: Report) => {
    const saved = await dataProvider.saveReport(report);
    setReports((prev) => ({ ...prev, [saved.patientId]: saved }));
  }, []);

  const generate = useCallback(
    async (patient: Patient) => {
      const { content, source } = await generateReportContent(patient);
      const report: Report = {
        id: reports[patient.id]?.id ?? crypto.randomUUID(),
        patientId: patient.id,
        status: "draft",
        aiContent: content,
        editedContent: content,
        source,
      };
      await persist(report);
    },
    [persist, reports]
  );

  const updateEdited = useCallback(
    async (patientId: string, content: ReportContent) => {
      const existing = reports[patientId];
      if (!existing) return;
      await persist({ ...existing, editedContent: content });
    },
    [persist, reports]
  );

  const validate = useCallback(
    async (patientId: string, validatedBy: string) => {
      const existing = reports[patientId];
      if (!existing) return;
      await persist({
        ...existing,
        status: "validated",
        validatedBy,
        validatedAt: new Date().toISOString(),
      });
    },
    [persist, reports]
  );

  const value = useMemo<StoreValue>(
    () => ({
      loading,
      providerKind: dataProvider.kind,
      patients,
      reports,
      getReport: (id) => reports[id],
      generate,
      updateEdited,
      validate,
    }),
    [loading, patients, reports, generate, updateEdited, validate]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
