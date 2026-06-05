import { useAudience, type Audience } from "../store/AudienceContext";

// Control segmentado para alternar la audiencia (y, con ella, el tono y la profundidad
// de la interfaz). Pensado para mostrar/presentar el mismo caso a familias o a clínicos.
const OPTIONS: { id: Audience; label: string; icon: string }[] = [
  { id: "clinica", label: "Clínica", icon: "🩺" },
  { id: "familia", label: "Familia", icon: "💬" },
];

export function AudienceSwitch() {
  const { audience, setAudience } = useAudience();
  return (
    <div
      className="inline-flex items-center rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200"
      role="tablist"
      aria-label="Audiencia de la vista"
    >
      {OPTIONS.map((o) => {
        const active = audience === o.id;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => setAudience(o.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active ? "bg-white text-ink-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
            title={o.id === "clinica" ? "Vista profesional, técnica y detallada" : "Vista cercana y sin jerga para familias"}
          >
            <span aria-hidden>{o.icon}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
