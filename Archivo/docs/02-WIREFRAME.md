# NeuroAR — Wireframe (ASCII + notas)

Convención: `▓` = elemento principal, `░` = secundario, `[…]` = interactivo, `«…»` = texto generado por IA.

---

## 1. Landing / Hero
```
┌──────────────────────────────────────────────────────────────────────┐
│  N  NeuroAR             [Para familias] [Para clínicos]   [Entrar →]│  ← nav translúcida
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│        ░░░░░  ((shader WebGL: cerebro de partículas)) ░░░░░          │
│       ░░░░░░░░  reacciona al cursor, paleta cian→violeta ░░░░░       │
│                                                                      │
│        Entender un informe                                           │  ← display 96px,
│        neuropsicológico                                              │     kerning tight,
│        no debería ser                                                │     línea por línea
│        un PDF.                                                       │     con stagger
│                                                                      │
│        Recorridos guiados por IA, con base en evidencia              │  ← subhead 20px
│        validada por un profesional.                                  │
│                                                                      │
│        [ Comenzar recorrido → ]   [ Ver demo (45s) ]                 │
│                                                                      │
│        ─────────────────────────────                                 │
│        Validado por Dra. Laura Méndez · TP-PSC-48217                 │  ← trust chip
└──────────────────────────────────────────────────────────────────────┘
```
**Detalles:** scroll suave, al bajar la cámara del cerebro hace zoom y aparecen 3 cards con los informes demo. Cursor magnético en los CTAs (estilo flagship.ai).

---

## 2. Modal de modo (al entrar)
```
        ┌─────────────────────────────────────────┐
        │   ¿Cómo quieres recorrer el informe?    │
        │                                         │
        │   ┌─────────────┐    ┌─────────────┐    │
        │   │   👨‍👩‍👧       │    │  🧠           │   │
        │   │  Familia    │    │ Profesional │    │
        │   │  Claro y    │    │ Clínico,    │    │
        │   │  cercano    │    │ evidencia   │    │
        │   └─────────────┘    └─────────────┘    │
        │                                         │
        │   ○ Recordar mi preferencia              │
        └─────────────────────────────────────────┘
```

---

## 3. Selector de informe
```
┌──────────────────────────────────────────────────────────────────────┐
│  Elige un informe                                                    │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ NA-2026-001  │  │ NA-2026-002  │  │ NA-2026-003  │                │
│  │ 9 años       │  │ 12 años      │  │ 15 años      │                │
│  │              │  │              │  │              │                │
│  │  ⬡ mini-radar│  │  ⬡ mini-radar│  │  ⬡ mini-radar│  ← SVG vivo    │
│  │              │  │              │  │              │     hover anim │
│  │ Aula · 21 may│  │ Aprend·24 may│  │ Vocac·28 may │                │
│  │ ●●○○○○ 2 áreas│  │ ●●●●●● ok    │  │ ●●●★★ 2 fortlz│              │
│  │ [ Abrir → ]  │  │ [ Abrir → ]  │  │ [ Abrir → ]  │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                      │
│  [ Comparar los 3 → ]   (solo modo profesional)                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Wizard — pantalla de dominio (el corazón)
```
┌──────────────────────────────────────────────────────────────────────┐
│ ◀ NA-2026-001 · 9 años · Modo Familia    ▓▓▓▓▓░░░░ 4/8       [ ☰ ]  │  ← progreso
├────────────────────────────────────────┬─────────────────────────────┤
│                                        │                             │
│   Atención                             │   ┌─────────────────────┐   │
│   ─────────                            │   │ 🤖 NeuroAR           │   │
│                                        │   │                     │   │
│   ┌────────────────┐                   │   │ «Vamos a hablar de  │   │
│   │      18        │  ← counter        │   │  atención. El       │   │
│   │   percentil    │     anim 0→18     │   │  resultado fue 18…»│   │
│   └────────────────┘                   │   │  ▏ (streaming)      │   │
│                                        │   │                     │   │
│   ░░░░ curva normal con el punto       │   │  [¿Por qué bajo?]   │   │
│       del paciente brillando ░░░░      │   │  [¿Qué hago en casa?]│  │
│   ┌──────────────────────────────┐     │   │  [Siguiente dominio]│   │
│   │  ╱╲                           │     │   └─────────────────────┘   │
│   │ ╱  ╲ ●─ tú estás aquí        │     │                             │
│   │╱    ╲___                      │     │   [ Escribir pregunta… ]   │
│   └──────────────────────────────┘     │                             │
│                                        │                             │
│   Evidencia (del informe):             │                             │
│   "Percentil 18 en atención,           │                             │
│    desempeño por debajo de             │                             │
│    lo esperado para su edad."          │                             │
│                                        │                             │
│   [ ◀ anterior ]      [ siguiente ▶ ]  │                             │
└────────────────────────────────────────┴─────────────────────────────┘
```
**Animaciones:**
- Entrada del dominio: título sube + curva se dibuja en stroke (path animation) + counter corre.
- Streaming de la narración en burbuja con cursor parpadeante.
- Quick-replies aparecen con stagger 80ms.

---

## 5. Wizard — Síntesis final
```
┌──────────────────────────────────────────────────────────────────────┐
│ Síntesis · NA-2026-001                              ▓▓▓▓▓▓▓▓ 8/8    │
│                                                                      │
│   ┌──── Radar perfil ────┐    ┌──── Para la familia ────────────┐   │
│   │                      │    │ • Rutinas estructuradas en casa │   │
│   │      Lenguaje        │    │ • Espacios sin distracción      │   │
│   │       /   \          │    │ • Refuerzo positivo             │   │
│   │ Mem ●─────● Atn      │    └─────────────────────────────────┘   │
│   │     │  ⬢  │          │                                          │
│   │ Vsp ●─────● Vel      │    ┌──── Para la institución ────────┐   │
│   │       \   /          │    │ • Ajustes razonables            │   │
│   │      FFEE            │    │ • Segmentación de tareas        │   │
│   └──────────────────────┘    └─────────────────────────────────┘   │
│                                                                      │
│   Resumen para padres                                                │
│   ╔════════════════════════════════════════════════════════════╗     │
│   ║ Este informe es una foto de un momento…                    ║     │
│   ╚════════════════════════════════════════════════════════════╝     │
│                                                                      │
│   ⚠ Limitaciones · Validado el 4 jun 2026 por Dra. Laura Méndez      │
│                                                                      │
│   [ Imprimir ]  [ Hablar con el asistente ]  [ Volver al inicio ]    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Dock de chat (siempre disponible)
```
                                              ┌───────────────────┐
                                              │  💬 Pregunta al   │
                                              │     asistente     │
                                              └───────────────────┘
                                                  ↑ pill flotante
                                                    bottom-right
```
Click → panel lateral 420px desde la derecha. Comparte estado con el wizard (sabe en qué dominio estás).

---

## 7. Vista comparativa (modo profesional)
```
┌──────────────────────────────────────────────────────────────────────┐
│  Comparar perfiles                                                   │
│                                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│   │ NA-001   │  │ NA-002   │  │ NA-003   │  ← radares overlay        │
│   └──────────┘  └──────────┘  └──────────┘                           │
│                                                                      │
│   Δ por dominio                                                      │
│   Atención       ▁▃▅                  18 → 48 → 62                   │
│   Memoria        ▁▂▃                  42 → 35 → 58                   │
│   FF. Ejec.      ▁▃▆                  22 → 40 → 75                   │
│   Lenguaje       ▃▆▅                  55 → 72 → 64                   │
│   Vel. Proc.     ▂▄▃                  28 → 50 → 46                   │
│   Visuoesp.      ▄▅▆                  60 → 68 → 80                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Sistema visual
- **Paleta:** fondo `#0A0E1A` (casi negro azulado) → degradados a `#1B2235`. Acentos `#7AE7FF` (cian eléctrico) y `#A78BFA` (violeta). Verde `#34D399` para "destacado", ámbar `#FBBF24` para "esperado", coral `#FB7185` para "bajo".
- **Tipografía:** display `Geist Sans` o `Inter Display` con `font-feature-settings: 'ss01'`. Mono `Geist Mono` para datos.
- **Grain / noise overlay** sutil (8% opacity) en todo el fondo — textura "film" como trinker.
- **Glassmorphism**: `backdrop-blur-xl` + `bg-white/[0.03]` + borde `1px solid white/[0.08]`.
- **Cursor magnético** en CTAs principales.
- **Microinteracciones**: scale 0.98 al click, glow on hover en cards, shimmer en estado loading.
