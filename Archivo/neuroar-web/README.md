# NeuroAR — Web

Recorrido conversacional con IA generativa sobre informes neuropsicológicos validados.

## Stack
Next.js 14 · React 18 · TypeScript · Tailwind 3 · Framer Motion · react-three-fiber · Vercel AI SDK (Anthropic).

## Setup

```bash
cp .env.example .env.local        # pega tu ANTHROPIC_API_KEY
npm install
npm run dev                       # http://localhost:3000
```

## Estructura

```
app/
  page.tsx                 landing + hero shader
  reports/page.tsx         selector de informe
  reports/[id]/page.tsx    wizard guiado
  compare/page.tsx         comparativa multi-paciente
  api/chat/route.ts        streaming Anthropic (Edge)
components/
  hero/                    HeroShader (r3f), MagneticCTA, HeroCopy
  wizard/                  WizardShell, DomainStep, PercentileCurve, Counter, QuickReplies, Welcome, Synthesis
  chat/                    ChatDock + ChatPanel (useChat de @ai-sdk/react)
  reports/                 MiniRadar, ReportCard
  ui/                      Button, Chip
lib/
  reports.ts               3 informes tipados
  domains.ts               metadata
  system-prompt.ts         construye el prompt grounded por modo
  mode.tsx                 Context familia/profesional
  chatBus.ts               event bus para abrir chat con prompt
```

## Decisiones clave
- **Sin backend** — datos en `lib/reports.ts`, único endpoint server es `/api/chat`.
- **Modelo:** `claude-haiku-4-5-20251001` por velocidad/coste. Cambiable en `app/api/chat/route.ts`.
- **System prompt** restringe respuestas al informe (sin alucinación), prohíbe diagnóstico, ajusta tono según modo familia/profesional.
- **Wizard adaptativo:** modo familia empieza por fortalezas, modo profesional por áreas bajas.
- **Curva normal** SVG custom con la posición del paciente — la innovación visual frente al "percentil 18" plano.

## Documentos
Ver `../docs/` para plan, wireframe, evaluación de innovación y decisiones detalladas.
