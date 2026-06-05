import { useEffect, useState, type ReactNode } from "react";
import { dataProvider } from "../lib/dataProvider";
import { getSupabase } from "../lib/supabaseClient";

// Solo exige login cuando el proveedor activo es Supabase (las políticas RLS necesitan
// un usuario autenticado). En modo mock, renderiza la app directamente.
export function AuthGate({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const requiresAuth = dataProvider.kind === "supabase" && Boolean(supabase);

  const [ready, setReady] = useState(!requiresAuth);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!requiresAuth || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [requiresAuth, supabase]);

  if (!requiresAuth || authed) return <>{children}</>;
  if (!ready) return <p className="p-8 text-sm text-slate-500">Cargando…</p>;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            N
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-900">NeuroAr Informes Inteligentes</div>
            <div className="text-xs text-slate-500">Acceso del profesional</div>
          </div>
        </div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="profesional@institucion.co"
        />
        <label className="mb-1 block text-xs font-medium text-slate-600">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="••••••••"
        />
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:bg-slate-300"
        >
          {busy ? "Ingresando…" : "Ingresar"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Acceso restringido por institución (RLS). Solo verá los pacientes de su institución.
        </p>
      </form>
    </div>
  );
}
