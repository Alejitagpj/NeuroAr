# Decisiones de implementación

## Stack — confirmado
- **Next.js 15 App Router + React 19 + TypeScript estricto**.
- **Tailwind v4** (config CSS-first, sin `tailwind.config.js`).
- **Framer Motion 11** para todas las animaciones.
- **shadcn-style components** copiados al repo (no dependencia npm) para tener control total.
- **Recharts** para radar; **SVG custom + D3-shape** para la curva normal.
- **react-three-fiber + drei + three** para el hero shader.
- **Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)** con `claude-haiku-4-5` para chat. Streaming via `useChat`.
- **Fuentes:** `Geist Sans` + `Geist Mono` via `next/font`.
- **Lucide-react** para iconos.

## Decisiones de producto
1. **Sin backend en v1.** Datos hardcodeados en `lib/reports.ts`. El único endpoint server es `/api/chat` (proxy seguro a Anthropic, la key no toca el cliente).
2. **Modelo:** Haiku 4.5. Las respuestas son cortas y guiadas — Opus es overkill y caro. Si la calidad falla en QA, subir a Sonnet 4.6.
3. **El system prompt es la pieza clínica más importante.** Vive en `lib/system-prompt.ts`, recibe el informe activo, y declara:
   - Tono (familia/profesional).
   - Reglas: nunca diagnosticar, nunca inventar percentiles, citar evidencia literal, redirigir si fuera de scope.
   - Lista de dominios y rangos del informe.
   - Recomendaciones literales del PDF.
4. **Quick-replies generadas estáticamente por dominio + por rango** (no por LLM) — son deterministas y rápidas. El LLM solo responde la pregunta cuando el usuario hace click o escribe.
5. **Voz:** `window.speechSynthesis` (gratis, sin API key). Toggle persistente. Voz `es-ES`/`es-MX` según disponibilidad del navegador.
6. **Persistencia:** `localStorage` keys `neuroar:mode`, `neuroar:lastReport`, `neuroar:voice`.
7. **Accesibilidad:** todo accionable por teclado, `prefers-reduced-motion` apaga el shader y reduce Framer.

## Decisiones visuales
- **Paleta** definida en `app/globals.css` como CSS vars (light/dark/clinical).
- **Modo oscuro por defecto** (referencias visuales son todas dark). Toggle a claro disponible.
- **Grain overlay** como SVG noise fijo en `body::after`.
- **Cursor magnético** solo en hero (no abusar).

## Arquitectura de carpetas
```
neuroar-web/
├── app/
│   ├── layout.tsx               (fuentes, providers, grain overlay)
│   ├── page.tsx                 (landing + hero)
│   ├── reports/
│   │   └── page.tsx             (selector)
│   ├── reports/[id]/
│   │   └── page.tsx             (wizard)
│   ├── compare/
│   │   └── page.tsx             (vista comparativa)
│   └── api/chat/route.ts        (streaming Anthropic)
├── components/
│   ├── hero/
│   │   ├── HeroShader.tsx       (r3f, cerebro de partículas)
│   │   └── MagneticCTA.tsx
│   ├── wizard/
│   │   ├── WizardShell.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DomainStep.tsx
│   │   ├── PercentileCurve.tsx  (SVG D3, paciente ubicado)
│   │   ├── Counter.tsx          (Framer animated number)
│   │   └── QuickReplies.tsx
│   ├── chat/
│   │   ├── ChatDock.tsx
│   │   └── ChatPanel.tsx        (useChat de AI SDK)
│   ├── reports/
│   │   ├── ReportCard.tsx       (con mini-radar)
│   │   ├── MiniRadar.tsx
│   │   └── FullRadar.tsx
│   └── ui/ (shadcn: button, card, dialog, tabs, scroll-area)
├── lib/
│   ├── reports.ts               (los 3 informes tipados)
│   ├── system-prompt.ts
│   ├── domains.ts               (metadata: color, icono, descripción base)
│   └── mode.tsx                 (Context: familia/profesional)
└── public/
    └── noise.svg
```

## Variables de entorno
- `ANTHROPIC_API_KEY` — server-only, leída en `/api/chat`.

## Definition of Done v1
- [ ] Landing con hero shader + 3 cards.
- [ ] Modal de modo funcional, persistente.
- [ ] Wizard de 8 pasos para los 3 informes.
- [ ] Curva normal renderizada por dominio.
- [ ] Chat dock con streaming real de Anthropic.
- [ ] Vista comparativa accesible solo en modo profesional.
- [ ] Modo voz funcional.
- [ ] Responsive (mobile breakpoint con wizard apilado).
- [ ] Lighthouse > 90 en performance, > 95 en a11y.

## Lo que NO haré (para no inflar scope)
- No subir PDFs nuevos.
- No auth.
- No DB.
- No export PDF.
- No i18n.
- No tests E2E (solo type-check + lint).
