# Documentación de endpoints PHP — NeuroAr Informes Inteligentes

El frontend React llama a estos endpoints desde `src/lib/phpApiClient.ts`.  
El equipo PHP debe implementarlos en el VPS / hosting Hostinger.  
Base URL configurable via `VITE_API_BASE_URL` (ej. `https://informes.neuroar.com.co/api`).

> **Seguridad mínima requerida:**  
> - Autenticación por sesión PHP o token Bearer.  
> - El header `X-Requested-With: XMLHttpRequest` siempre está presente (detección CSRF básica).  
> - Los datos de pacientes son **siempre anonimizados** (código, nunca nombre real).  
> - La API key del LLM vive **solo en el servidor** (VPS 1), nunca en el cliente.

---

## GET /api/patients

Lista todos los pacientes de la institución del profesional autenticado.

**Respuesta 200:**
```json
[
  {
    "id": "uuid",
    "code": "NA-2026-001",
    "age": 9,
    "institution": "Colegio Horizonte",
    "context": "Dificultades atencionales reportadas en aula.",
    "assessment_date": "2026-05-21",
    "professional_name": "Dra. Laura Méndez",
    "professional_license": "TP-PSC-48217",
    "results": [
      { "domain": "Atención", "percentile": 18, "range": "bajo" },
      { "domain": "Memoria",  "percentile": 42, "range": "esperado" }
    ]
  }
]
```

---

## GET /api/patients/:id

Detalle de un paciente.

**Respuesta 200:** mismo objeto que el ítem de la lista.  
**Respuesta 404:** `{ "error": "not_found" }`

---

## GET /api/reports?patient_id=:id

Informe actual de un paciente (si existe).

**Respuesta 200:**
```json
{
  "id": "uuid",
  "patient_id": "uuid",
  "status": "draft",
  "source": "ia",
  "ai_content": {
    "interpretacionPorDominio": [
      { "dominio": "Atención", "interpretacion": "...", "evidencia": "..." }
    ],
    "recomendaciones": [
      { "categoria": "familia", "recomendacion": "..." }
    ],
    "resumenParaPadres": "...",
    "limitaciones": "..."
  },
  "edited_content": { "...igual que ai_content..." },
  "validated_by": null,
  "validated_at": null
}
```
**Respuesta 404:** `{ "error": "not_found" }` (el frontend lo trata como "sin informe todavía").

---

## POST /api/reports

Crea o actualiza el informe de un paciente (upsert por `patient_id`).

**Body:**
```json
{
  "id": "uuid-o-null",
  "patient_id": "uuid",
  "status": "draft",
  "source": "fallback",
  "ai_content": { "...ReportContent..." },
  "edited_content": { "...ReportContent..." },
  "validated_by": null,
  "validated_at": null
}
```

**Respuesta 200/201:** el objeto `ApiReport` guardado (con `id` asignado si era nuevo).

> El backend también debe insertar una fila en `report_versions` y registrar en `audit_logs`.

---

## PUT /api/reports/:id/validate

Marca el informe como validado. Solo acepta la transición `draft → validated`.

**Body:**
```json
{ "validated_by": "Dra. Laura Méndez" }
```

**Respuesta 200:**
```json
{
  "...mismos campos ApiReport...",
  "status": "validated",
  "validated_by": "Dra. Laura Méndez",
  "validated_at": "2026-06-05T18:30:00-05:00"
}
```

> El backend debe registrar en `audit_logs` `action: "validate"`.

---

## GET /api/reports/:id/pdf

Descarga directa del PDF guardado en el servidor (VPS 1 / carpeta privada Hostinger).

**Respuesta 200:** `Content-Type: application/pdf` con el binario del PDF.  
**Respuesta 404:** si el informe no ha sido validado aún.

> Alternativa: el endpoint devuelve una **URL firmada** de descarga con expiración corta,  
> y el cliente hace la descarga desde esa URL.

---

## Flujo de IA en el servidor (VPS 1)

El frontend NO llama directamente a la API del LLM. Internamente el PHP / servicio Node
del VPS 1 hace:

```
POST /api/reports
  └─ backend recibe los puntajes anonimizados del paciente
  └─ llama a la API de Claude/OpenAI con ANTHROPIC_API_KEY (solo en el servidor)
  └─ guarda ai_content en la BD
  └─ devuelve el informe al frontend
```

Esto garantiza que la API key **nunca** llega al navegador del usuario.

---

## Tabla de errores esperados

| Código | Significado |
|--------|-------------|
| 200/201 | OK |
| 400 | Body inválido (campos requeridos faltantes) |
| 401 | No autenticado |
| 403 | Paciente de otra institución (aislamiento por institución) |
| 404 | Recurso no encontrado |
| 422 | Transición de estado inválida (ej. ya validado) |
| 500 | Error interno del servidor |
