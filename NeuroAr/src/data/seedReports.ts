import type { Report } from "../types/neuroar";

// Informes precargados para la demo (muestran el estado "validado" sin requerir IA/red).
// El de NA-2026-009 está adaptado de un informe real de prueba de memoria, con lenguaje
// prudente y NO diagnóstico (la IA propone, el profesional valida).
export const SEED_REPORTS: Report[] = [
  {
    id: "seed-p9",
    patientId: "p9",
    status: "validated",
    source: "ia",
    validatedBy: "Dra. Laura Méndez",
    validatedAt: "2026-05-06T15:20:00.000Z",
    aiContent: undefined,
    editedContent: {
      interpretacionPorDominio: [
        {
          dominio: "Memoria",
          interpretacion:
            "Los resultados sugieren un desempeño dentro del rango esperado en memoria de trabajo, " +
            "con una tendencia de mejora a lo largo de los intentos sucesivos. Se observó variabilidad " +
            "entre ensayos, patrón frecuente cuando intervienen factores atencionales y de regulación.",
          evidencia:
            "Serie de 8 intentos: progresión de 5 a 10 aciertos sobre 10, alcanzando la secuencia " +
            "completa sin errores en el último ensayo. Percentil 45 en memoria.",
        },
        {
          dominio: "Atención",
          interpretacion:
            "Los resultados sugieren un rendimiento inferior al rango esperado en atención sostenida. " +
            "La oscilación observada entre ensayos podría asociarse con la demanda atencional de la tarea " +
            "y conviene contrastarla con la observación clínica y el contexto.",
          evidencia: "Percentil 30 en atención, acompañado de variabilidad inter-ensayo en la prueba de memoria.",
        },
        {
          dominio: "Funciones ejecutivas",
          interpretacion:
            "Se observa un desempeño ligeramente por debajo de lo esperado en funciones ejecutivas. " +
            "La mejora con la práctica sugiere capacidad de beneficiarse de estrategias de organización " +
            "y autorregulación.",
          evidencia: "Percentil 38. Reducción progresiva del tiempo por intento (42s → 27s) y de los errores.",
        },
      ],
      recomendaciones: [
        {
          categoria: "profesional",
          recomendacion:
            "Implementar estrategias de memoria explícitas (segmentación de la información en bloques, " +
            "mnemotecnias y apoyo visual) y monitorear su efecto en intentos posteriores.",
        },
        {
          categoria: "institucion",
          recomendacion:
            "Favorecer un entorno de trabajo con baja distracción y técnicas de gestión del tiempo " +
            "(p. ej. bloques de enfoque tipo Pomodoro), considerando la alta demanda cognitiva del rol.",
        },
        {
          categoria: "profesional",
          recomendacion:
            "Valorar acompañamiento continuo orientado a la regulación atencional (p. ej. estrategias " +
            "cognitivo-conductuales o coaching especializado), sujeto al criterio del profesional tratante.",
        },
        {
          categoria: "familia",
          recomendacion:
            "Fomentar el automonitoreo y la retroalimentación frecuente para identificar patrones de " +
            "eficacia y áreas de mejora, reforzando los avances observados.",
        },
      ],
      resumenParaPadres:
        "Esta evaluación observa cómo responde la memoria de trabajo a lo largo de varios intentos. " +
        "Se aprecia una mejora clara con la práctica —llegando a completar la secuencia sin errores— " +
        "junto con cierta variabilidad entre ensayos, algo esperable. Estos resultados son una foto de " +
        "un momento y no constituyen un diagnóstico: orientan estrategias de apoyo que el profesional " +
        "revisará para acordar los próximos pasos.",
      limitaciones:
        "El informe se basa únicamente en la prueba de memoria de trabajo y en los puntajes por dominio " +
        "disponibles. No incorpora historia clínica completa ni observación directa adicional. Los " +
        "resultados pueden verse influidos por el estado emocional, el cansancio o el contexto de " +
        "aplicación. Requiere validación profesional y no constituye un diagnóstico.",
    },
  },
];
