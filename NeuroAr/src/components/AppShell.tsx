import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { getSupabase } from "../lib/supabaseClient";
import { AudienceSwitch } from "./AudienceSwitch";

export function AppShell({ children }: { children: ReactNode }) {
  const { providerKind } = useStore();
  const supabase = getSupabase();
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/app" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
              N
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight text-ink-900">
                NeuroAr Informes Inteligentes
              </div>
              <div className="text-xs text-slate-500">
                Generación, validación y trazabilidad de informes neuropsicológicos asistidos por IA
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <AudienceSwitch />
            <span
              className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline"
              title="Fuente de datos activa"
            >
              datos: {providerKind}
            </span>
            {providerKind === "supabase" && supabase && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-xs text-slate-400">
        La IA propone. El profesional valida. · Documento de apoyo, no constituye diagnóstico autónomo.
      </footer>
    </div>
  );
}
