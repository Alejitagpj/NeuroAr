# Evaluación de innovación

## Rúbrica
Comparo la propuesta contra (a) abrir el PDF, (b) un chat genérico (ChatGPT pegándole el PDF), (c) dashboards clínicos típicos.

| Dimensión | PDF | Chat genérico | Dashboard clínico | **NeuroAR** |
|---|---|---|---|---|
| Comprensión guiada | ✗ lineal | ~ depende del usuario | ✗ tablas | ✓ wizard adaptativo por audiencia |
| Visualización del percentil | ✗ barra plana | ✗ | ~ barras | ✓ curva normal + punto + comparativa |
| Conversación grounded | ✗ | ✗ alucina | ✗ | ✓ JSON del informe como única fuente |
| Adaptación familia vs clínico | ✗ | ~ si lo pides | ✗ | ✓ modo desde onboarding |
| Sensación premium 2026 | ✗ | ✗ | ~ | ✓ shader, voz, streaming, glass |
| Multi-informe | ✗ | ✗ | ~ | ✓ comparativa visual |
| Accesible (voz, teclado) | ~ | ~ | ~ | ✓ TTS + atajos |

## Lo verdaderamente novedoso (lo que defiendo)
1. **Wizard reordenado por audiencia.** En modo familia empieza por fortalezas (sostiene la conversación emocionalmente); en modo profesional empieza por áreas bajas (foco clínico). El **mismo dato, distinta narrativa** — eso es IA aplicada con criterio, no chat genérico.
2. **Curva normal con el paciente ubicado.** La familia no entiende "percentil 18". Sí entiende "tu hijo está aquí, en esta zona de la curva". Es una traducción visual que el PDF no hace.
3. **Asistente con guardrails de informe.** El system prompt fuerza: solo responde con datos del JSON, cita la evidencia textual del PDF, y si la pregunta sale del scope redirige a la profesional validadora. Esto es **lo opuesto a ChatGPT pegando el PDF** — es defensible clínicamente.
4. **Comparativa multi-corte.** Imposible con 3 PDFs sueltos. Aquí es un toggle.
5. **Hero shader + voz.** No es decoración: comunica "esto no es un trámite, es una experiencia pensada". Eleva la percepción del informe mismo.

## Lo que NO es novedoso (honestidad)
- El chat con streaming en sí ya es estándar.
- Recharts radar / barras ya se ven en todas partes.
- Glassmorphism y dark mode tampoco son innovación per se.

El valor está en la **combinación + el grounding clínico**, no en piezas sueltas.

## Veredicto
**Sí es innovador para el dominio neuropsicológico**, donde la entrega típica sigue siendo PDF + reunión presencial. No es innovador como pieza técnica aislada — el AI SDK, shaders y radares existen. La innovación es el **producto**: un informe que se explica solo, con criterio clínico, sin reemplazar al profesional.

## Riesgos a vigilar
- **Sobre-prometer en el hero.** El copy debe dejar claro "apoyo", no "diagnóstico". Ya lo marca el PDF y lo replico.
- **Alucinación del modelo.** Mitigación: prompt restrictivo + tests de "preguntas trampa" antes de mostrar a usuarios.
- **Performance del shader en móvil low-end.** Fallback a un gradiente animado CSS.
- **Accesibilidad del dark mode.** Contraste AA mínimo, modo claro disponible.
