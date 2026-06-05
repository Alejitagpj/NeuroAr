-- NeuroAr Informes Inteligentes — esquema inicial con RLS por institución.
-- Principio: cada profesional solo accede a datos de SU institución.

create extension if not exists "pgcrypto";

-- Instituciones
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('educativa', 'salud', 'organizacional'))
);

-- Profesionales (1:1 con auth.users)
create table if not exists professionals (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text,
  license_no text,
  institution_id uuid not null references institutions (id)
);

-- Pacientes (anonimizados: code, NO nombre real)
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  age int not null,
  context text,
  assessment_date date not null,
  institution_id uuid not null references institutions (id),
  professional_name text not null,
  professional_license text,
  results jsonb not null default '[]',
  created_by uuid references professionals (id),
  created_at timestamptz not null default now()
);

-- Informes
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  status text not null default 'draft' check (status in ('not_generated', 'draft', 'validated')),
  source text check (source in ('ia', 'fallback')),
  ai_content jsonb,
  edited_content jsonb,
  validated_by text,
  validated_at timestamptz,
  pdf_url text,
  updated_at timestamptz not null default now(),
  unique (patient_id)
);

-- Vista que aplana el paciente para el frontend (incluye institución por nombre)
create or replace view patients_view as
select
  p.id,
  p.code,
  p.age,
  p.context,
  p.assessment_date,
  i.name as institution,
  p.professional_name,
  p.professional_license,
  p.results,
  p.institution_id
from patients p
join institutions i on i.id = p.institution_id;

-- Helper: institución del profesional autenticado
create or replace function current_institution_id()
returns uuid
language sql stable
as $$
  select institution_id from professionals where id = auth.uid()
$$;

-- RLS
alter table institutions enable row level security;
alter table professionals enable row level security;
alter table patients enable row level security;
alter table reports enable row level security;

-- Un profesional ve su propia institución
create policy "inst_self_read" on institutions
  for select using (id = current_institution_id());

-- Un profesional ve/gestiona su propio registro
create policy "prof_self" on professionals
  for select using (id = auth.uid());

-- Pacientes: solo los de la institución del profesional
create policy "patients_by_institution" on patients
  for all using (institution_id = current_institution_id())
  with check (institution_id = current_institution_id());

-- Informes: solo de pacientes de su institución
create policy "reports_by_institution" on reports
  for all using (
    patient_id in (select id from patients where institution_id = current_institution_id())
  )
  with check (
    patient_id in (select id from patients where institution_id = current_institution_id())
  );
