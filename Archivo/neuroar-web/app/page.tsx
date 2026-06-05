import HeroShader from '@/components/hero/HeroShaderClient';
import { MagneticCTA } from '@/components/hero/MagneticCTA';
import { Chip } from '@/components/ui/Chip';
import { TopNav } from '@/components/TopNav';
import { LandingFooter } from '@/components/LandingFooter';
import { HeroCopy } from '@/components/hero/HeroCopy';

export default function Page() {
  return (
    <>
      <TopNav />
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <HeroShader />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32 w-full">
          <HeroCopy />
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <MagneticCTA href="/reports">Comenzar recorrido →</MagneticCTA>
            <MagneticCTA href="/reports" variant="ghost">Ver los 3 informes demo</MagneticCTA>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-3 opacity-80">
            <Chip>Validado por Dra. Laura Méndez · TP-PSC-48217</Chip>
            <Chip>3 informes demo cargados</Chip>
            <Chip>IA grounded en el PDF</Chip>
          </div>
        </div>
      </section>

      <LandingFeatures />
      <LandingFooter />
    </>
  );
}

function LandingFeatures() {
  const items = [
    {
      title: 'Wizard que se adapta a quién lee',
      body:
        'Familia o profesional. El recorrido cambia el orden de los dominios y el tono de la narración. El mismo dato, otra historia.',
    },
    {
      title: 'Asistente que solo cita el informe',
      body:
        'Sin alucinaciones. Si la pregunta sale del informe, el asistente lo dice y te redirige a la profesional validadora.',
    },
    {
      title: 'Percentiles en la curva, no en una tabla',
      body:
        'Cada dominio se ubica en la curva normal. La familia ve dónde está su hijo, no solo un número entre 0 y 100.',
    },
  ];
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32">
      <h2 className="display text-4xl md:text-6xl text-balance max-w-3xl">
        No es un PDF interactivo.<br />
        <span className="text-shimmer">Es un co-piloto del informe.</span>
      </h2>
      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.title} className="glass p-7 h-full">
            <h3 className="text-xl font-medium tracking-tight">{it.title}</h3>
            <p className="mt-3 text-ink-dim leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
