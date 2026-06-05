# NeuroAR — Plan de Producto

## Visión en una frase
Una experiencia **web cinematográfica, conversacional y guiada por IA generativa** donde familias, profesionales o instituciones recorren un informe neuropsicológico como si fuera una historia — con visualizaciones 3D del perfil cognitivo, narración adaptativa, y un asistente que responde con base **exclusivamente** en el contenido validado del PDF.

No es un PDF interactivo. Es un **co-piloto explicativo** del informe.

---

## Audiencias (modo dual)
1. **Familia / tutor** — lenguaje cálido, claro, sin jerga. Foco: qué significa, qué hacer en casa.
2. **Profesional** — lenguaje clínico, foco en evidencia, percentiles, recomendaciones técnicas, comparación entre cortes.

El modo se elige en el onboarding y reconfigura tono, profundidad y CTA del asistente.

---

## Pilares de experiencia
1. **Hero cinematográfico** — shader WebGL animado (estilo trinker.media / evolt.health) con un "cerebro" de partículas que reacciona al cursor. Tipografía display grande, copy minimalista.
2. **Selector de informe** — cards translúcidas (glassmorphism sobrio) con preview del perfil cognitivo en mini-radar.
3. **Wizard conversacional guiado** — 6 capítulos animados (uno por dominio cognitivo) + apertura + cierre. Cada capítulo:
   - Métrica grande animada (counter 0 → percentil)
   - Visualización contextual (barra de rango, distribución normal con el punto del paciente, sparkline si hay seguimiento)
   - Narración IA streaming en burbuja
   - Quick-replies adaptativas ("¿Por qué bajo?", "¿Qué hago en casa?", "Compara con la media")
4. **Asistente libre** — chat persistente a la derecha. Grounded **solo** en el JSON del informe + recomendaciones. Si pregunta algo fuera del scope → responde "no está en el informe" + sugiere consultar a la profesional.
5. **Vista comparativa** — overlay de los 3 informes en un radar conjunto (modo profesional).
6. **Modo voz** — TTS del navegador para la narración (accesibilidad + sensación premium).

---

## Stack
- **Next.js 15 (App Router) + React 19** — SSR para SEO/print, RSC para servir datos del informe sin bundle bloat.
- **TypeScript estricto**.
- **Tailwind v4 + tokens propios** — el sistema de color se define en CSS vars (light/dark/clinical).
- **Framer Motion 11** — orquestación de animaciones de capítulo, transiciones de página, counter, reveals.
- **shadcn/ui** seleccionado (Button, Card, Dialog, Tabs, ScrollArea) — base accesible, sin lock-in.
- **Recharts** para radar y barras de percentil; **D3-shape** para curva de distribución normal custom.
- **react-three-fiber + drei** para el hero (instanced points formando un cerebro low-poly que respira y reacciona al mouse).
- **Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)** — streaming del chat con `claude-haiku-4-5` (rápido, barato, suficiente).
- **System prompt grounded**: se inyecta el JSON del informe activo + reglas duras ("nunca diagnosticar", "citar evidencia", "si no está en el informe, dilo").
- **Persistencia local** — `localStorage` para preferencias (modo, último informe, voz on/off). Sin backend en v1.

### Datos
Los 3 PDFs ya están estructurados. Los normalizo a JSON tipado en `data/reports.ts`. Schema:

```ts
type Report = {
  id: string; code: string; age: number; date: string;
  institution: string; professional: { name: string; license: string };
  context: string;
  domains: { key: DomainKey; label: string; percentile: number; range: 'bajo' | 'esperado' | 'destacado'; interpretation: string; evidence: string }[];
  recommendations: { audience: 'family' | 'institution' | 'professional'; text: string }[];
  parentSummary: string; limitations: string; validation: { date: string; by: string };
}
```

---

## Flujos clave

### F1 — Llegada
Hero → "Comenzar recorrido" → modal de modo (Familia / Profesional) → selector de informe → wizard.

### F2 — Wizard
8 pasos: Bienvenida personalizada → 6 dominios (orden inteligente: primero fortalezas si modo familia, primero áreas bajas si modo profesional) → Síntesis con recomendaciones + resumen para padres.

Cada paso: 1 pantalla, scroll bloqueado, navegación por teclas/botones + barra de progreso superior.

### F3 — Chat libre
Accesible siempre desde un dock flotante. Mantiene contexto del informe activo. Sugerencias rotativas según el paso del wizard.

### F4 — Comparar (profesional)
Toggle en header → grid 1x3 con radares pequeños + tabla de delta por dominio.

---

## Innovación medible (qué nos diferencia de "abrir el PDF")
- **Comprensión guiada vs lectura lineal** — el wizard adapta el orden y tono.
- **Grounded AI vs ChatGPT genérico** — respuestas solo del informe, citables.
- **Visualización de la distribución normal** con el percentil ubicado — la familia ve dónde está su hijo en una curva, no solo un número.
- **3D + voz + streaming** — sensación de producto 2026, no PDF 2010.
- **Comparativa multi-paciente** — imposible en PDFs sueltos.

---

## Out of scope (v1)
- Auth real, multi-tenant, base de datos.
- Subida de PDFs nuevos (los 3 vienen hardcodeados como demo).
- Export PDF del recorrido.
- i18n (solo ES).
