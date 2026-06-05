-- NeuroAr Informes Inteligentes — Esquema MySQL/MariaDB
-- Base de datos en Hostinger. Compatible con phpMyAdmin.
-- Principio: datos de pacientes SIEMPRE anonimizados (código, no nombre real).

SET NAMES utf8mb4;
SET time_zone = '-05:00'; -- Colombia (UTC-5)

-- ---------------------------------------------------------------------------
CREATE TABLE institutions (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  name       VARCHAR(200) NOT NULL,
  type       ENUM('educativa','salud','organizacional') NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
CREATE TABLE professionals (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  name           VARCHAR(200) NOT NULL,
  email          VARCHAR(200),
  license_no     VARCHAR(100),
  institution_id CHAR(36)     NOT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Pacientes: identificados SOLO por código anónimo, nunca nombre real.
CREATE TABLE patients (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  code           VARCHAR(50)  NOT NULL UNIQUE, -- ej. "NA-2026-001"
  age            TINYINT      NOT NULL,
  context        TEXT,
  assessment_date DATE        NOT NULL,
  institution_id CHAR(36)     NOT NULL,
  professional_name    VARCHAR(200) NOT NULL,
  professional_license VARCHAR(100),
  created_by     CHAR(36),
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (created_by)     REFERENCES professionals(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Evaluaciones: puntajes por dominio cognitivo en JSON.
CREATE TABLE assessments (
  id         CHAR(36)  NOT NULL DEFAULT (UUID()),
  patient_id CHAR(36)  NOT NULL,
  date       DATE      NOT NULL,
  results    JSON      NOT NULL COMMENT
    '[{"domain":"Atención","percentile":42,"range":"esperado"}]',
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Informes generados: contenido IA + contenido editado por el profesional.
CREATE TABLE reports (
  id             CHAR(36)  NOT NULL DEFAULT (UUID()),
  patient_id     CHAR(36)  NOT NULL UNIQUE,
  status         ENUM('not_generated','draft','validated') NOT NULL DEFAULT 'draft',
  source         ENUM('ia','fallback'),
  ai_content     JSON      COMMENT 'Contenido generado por IA (sin editar)',
  edited_content JSON      COMMENT 'Contenido revisado y aprobado por el profesional',
  validated_by   VARCHAR(200),
  validated_at   DATETIME,
  pdf_path       VARCHAR(500) COMMENT 'Ruta en el servidor / URL firmada del PDF',
  updated_at     DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Historial de versiones de informe (trazabilidad y auditoría).
CREATE TABLE report_versions (
  id         CHAR(36)  NOT NULL DEFAULT (UUID()),
  report_id  CHAR(36)  NOT NULL,
  version    SMALLINT  NOT NULL DEFAULT 1,
  content    JSON      NOT NULL,
  author     VARCHAR(200),
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Log de auditoría: quién hizo qué y cuándo.
CREATE TABLE audit_logs (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  actor      VARCHAR(200),
  action     VARCHAR(100) NOT NULL, -- 'generate','edit','validate','download_pdf'
  entity     VARCHAR(50),           -- 'report','patient'
  entity_id  CHAR(36),
  detail     JSON,
  ip         VARCHAR(45),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_entity (entity, entity_id),
  INDEX idx_actor  (actor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- Seed de demostración
INSERT INTO institutions (id, name, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Colegio Horizonte', 'educativa');

INSERT INTO patients (code, age, context, assessment_date, institution_id, professional_name, professional_license) VALUES
  ('NA-2026-001', 9,  'Dificultades atencionales reportadas en aula.', '2026-05-21',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217'),
  ('NA-2026-002', 12, 'Seguimiento de habilidades de aprendizaje.',    '2026-05-24',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217'),
  ('NA-2026-003', 15, 'Perfil cognitivo para acompañamiento académico.','2026-05-28',
   '11111111-1111-1111-1111-111111111111', 'Dra. Laura Méndez', 'TP-PSC-48217');
