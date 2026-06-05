import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Audiencia activa de la interfaz:
//   - "clinica":  vista profesional, densa y técnica (claro institucional + laboratorio de datos).
//   - "familia":  vista cálida y simplificada, sin jerga ni percentiles (lenguaje cercano).
// La elección se conserva entre sesiones.
export type Audience = "clinica" | "familia";

type AudienceValue = {
  audience: Audience;
  setAudience: (a: Audience) => void;
  toggle: () => void;
};

const AudienceContext = createContext<AudienceValue | null>(null);
const STORAGE_KEY = "neuroar.audience";

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(() => {
    if (typeof localStorage === "undefined") return "clinica";
    return (localStorage.getItem(STORAGE_KEY) as Audience) || "clinica";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, audience);
    } catch {
      /* almacenamiento no disponible: se mantiene en memoria */
    }
  }, [audience]);

  const value = useMemo<AudienceValue>(
    () => ({
      audience,
      setAudience: setAudienceState,
      toggle: () => setAudienceState((a) => (a === "clinica" ? "familia" : "clinica")),
    }),
    [audience]
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience(): AudienceValue {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error("useAudience debe usarse dentro de <AudienceProvider>");
  return ctx;
}
