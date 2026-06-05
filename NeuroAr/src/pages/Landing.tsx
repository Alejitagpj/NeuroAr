import { Link } from "react-router-dom";
import { BrainCanvas } from "../components/BrainCanvas";

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* fondo: resplandor + grilla sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold">N</div>
          <span className="text-sm font-semibold tracking-tight">NeuroAr</span>
        </div>
        <Link
          to="/app"
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
        >
          Entrar a la plataforma →
        </Link>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-6 lg:grid-cols-2 lg:pt-12">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Informes neuropsicológicos asistidos por IA
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            De puntajes crudos a un{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-brand-400 bg-clip-text text-transparent">
              informe validado
            </span>{" "}
            en minutos.
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-300">
            NeuroAr Informes Inteligentes transforma evaluaciones por dominios cognitivos en
            interpretación clínica, recomendaciones y un resumen para familias. La IA propone,
            el profesional valida, y el PDF se genera con un clic.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
            >
              Comenzar ahora
            </Link>
            <a
              href="#flujo"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Tip: gira el cerebro y haz clic en una región dentro de un paciente para explorar su dominio cognitivo.
          </p>
        </div>

        {/* cerebro 3D */}
        <div className="relative h-[360px] w-full sm:h-[440px] lg:h-[520px]">
          <BrainCanvas className="h-full w-full" interactive={false} />
        </div>
      </section>

      {/* flujo */}
      <section id="flujo" className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Selecciona el paciente", d: "Datos anonimizados por código, nunca nombres." },
            { n: "02", t: "Genera con IA", d: "Interpretación, recomendaciones y resumen familiar." },
            { n: "03", t: "Revisa y valida", d: "El profesional edita y aprueba (human-in-the-loop)." },
            { n: "04", t: "Descarga el PDF", d: "Informe institucional con disclaimer y firma." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
              <div className="text-xs font-semibold text-cyan-300">{s.n}</div>
              <div className="mt-2 text-sm font-semibold">{s.t}</div>
              <div className="mt-1 text-xs text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
