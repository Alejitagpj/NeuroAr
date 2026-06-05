# NeuroAr Informes Inteligentes

**Plataforma de generación, validación y trazabilidad de informes neuropsicológicos asistidos por IA.**

> La IA propone. El profesional valida.

---

## 1. Problema que resuelve

Los neuropsicólogos y profesionales de NeuroAr tardan **horas** en convertir la *data* de
evaluaciones por dominios cognitivos en **informes PDF** estructurados, interpretados,
con recomendaciones y validados. El proceso es lento, manual y poco consistente, lo que
dificulta su **comercialización** a escala en instituciones educativas, de salud y de
gestión de cambio organizacional.

## 2. Usuario / área beneficiaria

- **Profesional** (neuropsicólogo/a) que interpreta y valida.
- **Institución** (educativa, salud, organizacional) que recibe y actúa sobre el informe.
- **Familias/tutores**, mediante un resumen en lenguaje claro.
- Área de NeuroAr: **Operaciones y Comercial**.

## 3. Descripción corta de la solución

Web app donde el profesional selecciona un paciente **anonimizado**, revisa sus resultados
por dominio cognitivo, **genera con IA** una interpretación + recomendaciones + resumen para
padres, **edita y valida** el contenido (human-in-the-loop) y **descarga un PDF profesional**
por paciente con disclaimer y firma. El valor de la IA = convertir puntajes crudos en
narrativa clínica coherente y accionable **en minutos en vez de horas**.

## 4. Cómo correr el proyecto

```bash
npm install
cp .env.example .env   # opcional: por defecto usa datos mock (demo infalible)
npm run dev            # http://localhost:5173
```

Build de producción y verificaciones:

```bash
npm run build               # type-check + build
node scripts/verifyPdf.mjs  # render headless del PDF (smoke test del corazón del MVP)
```

Por defecto `VITE_DATA_PROVIDER=mock` → **la demo funciona sin Supabase ni API key**.

## 5. Herramientas utilizadas

- **Vite + React + TypeScript + Tailwind CSS** (UI sobria, clínica, institucional).
- **@react-pdf/renderer** para el PDF (gráfico de barras con primitivas, sin dependencias frágiles).
- **Recharts** para la visualización en la vista web.
- **Supabase** (Postgres + Auth + RLS + Storage + Edge Functions) como backend de producción.
- **Claude (Anthropic)** vía Edge Function para la redacción clínica; **fallback determinístico**
  local como red de seguridad.

## 6. Flujo / arquitectura básica

```
Dashboard (pacientes + estado)
  └─ Paciente: resultados por dominio (tabla + gráfico)
       └─ "Generar informe asistido por IA"
            ├─ Edge Function generate-report (LLM real, key en servidor)
            └─ Fallback determinístico local  ← si no hay key/red/error
       └─ Editor profesional (revisa y edita)
       └─ "Validar informe y preparar PDF"  → estado: validado
       └─ "Descargar PDF"  (react-pdf, bajo demanda)
```

Capa de datos **conmutable** (`src/lib/dataProvider.ts`): `mockProvider` (en memoria) o
`supabaseProvider` (Postgres + RLS), seleccionada por `VITE_DATA_PROVIDER`. Si Supabase
falla en vivo, se conmuta a `mock` con una variable y la demo sigue.

Archivos clave:

| Archivo | Rol |
|---|---|
| `src/types/neuroar.ts` | Tipos del dominio (Patient, Report, ReportContent…) |
| `src/data/demoData.ts` | 3 pacientes demo anonimizados |
| `src/lib/reportGenerator.ts` | **Fallback determinístico** (no diagnóstico) |
| `src/lib/aiClient.ts` | Orquesta LLM real → fallback |
| `src/lib/dataProvider.ts` + `mock/supabaseProvider.ts` | Capa de datos conmutable |
| `src/pdf/NeuroArReportPdf.tsx` | Documento PDF institucional |
| `src/pages/PatientPage.tsx` | Flujo generar → editar → validar → PDF |
| `supabase/migrations/0001_init.sql` | Esquema + **RLS por institución** |
| `supabase/functions/generate-report/` | Edge Function (LLM, key en servidor) |

## 7. Cómo funciona la IA / fallback

- **IA real:** el front llama a la Edge Function `generate-report` con un payload
  **anonimizado** (código, edad, contexto, percentiles — **sin nombres**). La Edge Function
  llama a Claude con un *system prompt* que prohíbe diagnosticar y exige JSON válido.
- **Fallback:** si no hay API key, falla la red o el JSON es inválido, se usa
  `generateFallbackReport`, que produce contenido prudente por reglas de percentil
  (`<25` bajo, `25–69` esperado, `≥70` destacado) con lenguaje no diagnóstico
  ("los resultados sugieren…", nunca "el paciente tiene…").
- **La demo nunca falla por falta de API key.**

## 8. Riesgos y consideraciones éticas

- **Datos de menores:** anonimización por código (nunca nombres), **principio de mínimos
  datos** en el prompt, RLS por institución, cifrado en reposo (Supabase).
- **Marco legal (Colombia):** Ley **1581 de 2012 (Habeas Data)** y consentimiento informado
  de padres/tutores para el tratamiento de datos de menores.
- **Responsabilidad clínica:** *human-in-the-loop* obligatorio + **disclaimer** en el PDF.
  La IA **asiste, no diagnostica**.
- **Trazabilidad:** se registra quién valida (`validatedBy`) y cuándo (`validatedAt`).
- **Comprensión para familias:** informe de doble capa (técnico + resumen sencillo).

## 9. Próximos pasos para implementación real

Ver *Roadmap* abajo.

---

## Arquitectura de producción — integración con infraestructura NeuroAr

> "No proponemos reemplazar la infraestructura de NeuroAr. Diseñamos una **capa inteligente
> que se integra** con su web, base de datos y VPS actuales, reduciendo riesgo técnico y
> acelerando adopción real."

NeuroAr ya tiene web, base de datos y servidores en **Hostinger**. La solución se enchufa
sobre lo que ya existe, sin migraciones ni riesgos innecesarios.

```
┌──────────────────────────────────────────────────────────────────┐
│  informes.neuroar.com.co  (subdominio del frontend React/MVP)    │
│  → desplegado en Hostinger o VPS 2                               │
└────────────────────┬─────────────────────────────────────────────┘
                     │ GET/POST /api/*  (solo datos anonimizados)
┌────────────────────▼─────────────────────────────────────────────┐
│  Backend PHP — Hostinger                                         │
│  · Lee pacientes y evaluaciones de la BD MySQL/MariaDB existente │
│  · Guarda informes, versiones y auditoría                        │
│  · Llama al servicio de IA en VPS 1 (sin exponer la API key)     │
└────────┬──────────────────────┬────────────────────────────────--┘
         │                      │
┌────────▼──────┐    ┌──────────▼────────────────────────────────--┐
│  MySQL/Maria  │    │  VPS 1 — Servicio de IA (Node/Python)        │
│  Hostinger    │    │  · API key de Claude/Anthropic (solo aquí)   │
│  institutions │    │  · Recibe puntajes anonimizados              │
│  professionals│    │  · Devuelve interpretación JSON              │
│  patients     │    │  · Genera y guarda PDF en carpeta privada    │
│  assessments  │    └───────────────────────────────────────────--┘
│  reports      │
│  audit_logs   │    VPS 2 (opcional): staging / workers /
└───────────────┘    backups / generación asíncrona de PDFs
```

### Flujo completo (8 pasos)
1. El profesional abre `informes.neuroar.com.co` → la app consulta la BD MySQL actual de NeuroAr.
2. Selecciona un paciente/evaluación.
3. El frontend envía **solo datos mínimos y anonimizados** (código, edad, percentiles) al PHP.
4. El PHP llama al servicio de IA en VPS 1 → Claude genera interpretación + recomendaciones + resumen familiar.
5. El profesional edita y valida (human-in-the-loop).
6. El PHP guarda informe, versión, auditoría y estado en MySQL.
7. El servicio del VPS genera el PDF y lo guarda en carpeta privada del servidor.
8. El profesional descarga el PDF desde la plataforma (URL protegida o firmada).

### Archivos de referencia para el equipo PHP
- **`docs/mysql-schema.sql`** — tablas `institutions`, `professionals`, `patients`,
  `assessments`, `reports`, `report_versions`, `audit_logs` listas para importar en phpMyAdmin.
- **`docs/php-endpoints.md`** — contrato completo de los 5 endpoints que el frontend consume
  (`GET /patients`, `GET /patients/:id`, `GET/POST /reports`, `PUT /reports/:id/validate`, `GET /reports/:id/pdf`).
- **`src/lib/phpApiClient.ts`** — cliente HTTP tipado del frontend; implementa exactamente esos endpoints.
- **`src/lib/phpProvider.ts`** — implementación del DataProvider para PHP/MySQL.

### Activar el proveedor PHP (cuando el equipo PHP tenga los endpoints listos)
```bash
# .env
VITE_DATA_PROVIDER=php
VITE_API_BASE_URL=https://informes.neuroar.com.co/api
```
La app conmuta automáticamente. Sin ese env var, sigue en mock (demo infalible).

### Supabase (alternativa cloud — no es la recomendación principal)
Si en el futuro NeuroAr decide desacoplar la BD del hosting compartido, hay una implementación
Supabase lista en `supabase/` con el esquema equivalente y RLS por institución.
Activar: `VITE_DATA_PROVIDER=supabase` + `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

## Despliegue en Railway (frontend) + Supabase (backend)

El frontend es un SPA estático; en Railway se construye con Nixpacks y se sirve `dist/`
con fallback SPA (`serve -s dist`). El backend real es Supabase. Config ya incluida:
`railway.json`, script `start` y `serve` como dependencia.

> ⚠️ Las variables `VITE_*` se **hornean en build**, no en runtime. Deben estar como
> variables del servicio en Railway **antes** del build. La anon key es pública por diseño.

### A. Preparar Supabase (modo real)
1. Crear proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** → ejecutar `supabase/migrations/0001_init.sql` y luego `supabase/seed.sql`.
3. **Authentication → Users → Add user**: crear un profesional (correo + contraseña) y copiar su UUID.
4. Ejecutar el `INSERT` comentado al final de `seed.sql` con ese UUID (vincula al profesional
   con la institución → RLS le mostrará solo sus pacientes).
5. **Edge Function + IA real:**
   ```bash
   supabase functions deploy generate-report
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```

### B. Desplegar en Railway
1. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → este repo,
   rama `claude/jolly-johnson-3adY5`.
2. En **Variables** del servicio, añadir (antes del primer build):
   ```
   VITE_DATA_PROVIDER=supabase
   VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
3. Railway detecta Nixpacks → `npm install` → `npm run build` → `npm run start`
   (`serve -s dist -l $PORT`). En **Settings → Networking → Generate Domain** para obtener la URL pública.
4. Abrir la URL → iniciar sesión con el profesional creado → generar / validar / descargar PDF.

> Red de seguridad: si no defines las variables de Supabase, el selector cae a **mock**
> automáticamente y la demo funciona igual (sin login). Útil si Supabase falla en vivo.

### CLI (opcional)
```bash
npm i -g @railway/cli
railway login
railway init      # o: railway link  (a un proyecto existente)
railway up        # despliega; configura las variables con `railway variables`
```

## Roadmap (próximos pasos)

- Integración directa con la plataforma NeuroAr (ingesta en tiempo real).
- Login y roles reales + RLS por institución en producción.
- Almacenamiento seguro de PDFs en Storage con URLs firmadas.
- Auditoría completa de acciones.
- **RAG** con historial clínico anonimizado para enriquecer recomendaciones.
- **OCR** (Gemini multimodal) para importar capturas/PDF de evaluaciones.
- Envío seguro de reportes a padres/tutores.
- Panel institucional de impacto.
- Piloto con una institución aliada.

### Estrategia multimodelo (arquitectura objetivo)

| Modelo | Uso en NeuroAr |
|---|---|
| **Gemini** (multimodal) | Ingesta/OCR de evaluaciones en imagen/PDF → JSON |
| **Claude** (redacción clínica) | Interpretación + recomendaciones + resumen para padres |
| **GPT / Whisper** | Transcripción de notas de voz del profesional |
| **Embeddings** | RAG sobre historial clínico anonimizado |

En el MVP: **1 modelo real** (Claude) + fallback; el resto es arquitectura objetivo.

---

## Modelo comercial (resumen)

SaaS **B2B por institución** (suscripción) + **agentes/distribuidores** con comisión.
Pricing por nº de informes o por asientos de profesional. Métrica de valor:
*de horas por informe → minutos*, con informes consistentes y trazables.
