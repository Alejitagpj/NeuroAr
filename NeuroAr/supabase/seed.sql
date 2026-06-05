-- Seed de demostración para NeuroAr.
-- Crea 1 institución y 3 pacientes anonimizados con resultados sintéticos por dominio.
-- NOTA: el/los profesional(es) se crean al registrar usuarios vía Supabase Auth; luego
-- inserta su fila en `professionals` con la institution_id correspondiente.

insert into institutions (id, name, type) values
  ('11111111-1111-1111-1111-111111111111', 'Colegio Horizonte', 'educativa')
on conflict do nothing;

insert into patients (code, age, context, assessment_date, institution_id, professional_name, professional_license, results) values
  ('NA-2026-001', 9, 'Dificultades atencionales reportadas en aula.', '2026-05-21',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217',
   '[{"domain":"Atención","percentile":18,"range":"bajo"},{"domain":"Memoria","percentile":42,"range":"esperado"},{"domain":"Funciones ejecutivas","percentile":22,"range":"bajo"},{"domain":"Lenguaje","percentile":55,"range":"esperado"},{"domain":"Velocidad de procesamiento","percentile":28,"range":"esperado"},{"domain":"Habilidades visuoespaciales","percentile":60,"range":"esperado"}]'),
  ('NA-2026-002', 12, 'Seguimiento de habilidades de aprendizaje.', '2026-05-24',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217',
   '[{"domain":"Atención","percentile":48,"range":"esperado"},{"domain":"Memoria","percentile":35,"range":"esperado"},{"domain":"Funciones ejecutivas","percentile":40,"range":"esperado"},{"domain":"Lenguaje","percentile":72,"range":"destacado"},{"domain":"Velocidad de procesamiento","percentile":50,"range":"esperado"},{"domain":"Habilidades visuoespaciales","percentile":68,"range":"esperado"}]'),
  ('NA-2026-003', 15, 'Perfil cognitivo para acompañamiento académico.', '2026-05-28',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217',
   '[{"domain":"Atención","percentile":62,"range":"esperado"},{"domain":"Memoria","percentile":58,"range":"esperado"},{"domain":"Funciones ejecutivas","percentile":75,"range":"destacado"},{"domain":"Lenguaje","percentile":64,"range":"esperado"},{"domain":"Velocidad de procesamiento","percentile":46,"range":"esperado"},{"domain":"Habilidades visuoespaciales","percentile":80,"range":"destacado"}]')
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- Vincular el profesional autenticado a la institución (necesario para RLS).
-- 1) Crea el usuario en Supabase: Authentication → Users → Add user
--    (correo + contraseña). Copia su UUID.
-- 2) Reemplaza <AUTH_USER_UUID> abajo y ejecuta este INSERT:
--
-- insert into professionals (id, name, email, license_no, institution_id) values
--   ('<AUTH_USER_UUID>', 'Dra. Laura Méndez', 'profesional@institucion.co',
--    'TP-PSC-48217', '11111111-1111-1111-1111-111111111111')
-- on conflict (id) do nothing;
--
-- Con esto, al iniciar sesión en la app (modo supabase), current_institution_id()
-- devolverá la institución y RLS mostrará solo SUS pacientes.
-- ---------------------------------------------------------------------------
