-- Esquema de S.I.G.A.M. (idempotente: puedes ejecutarlo varias veces).
-- Si tu base ya tiene estas tablas, no se modifica nada.

CREATE TABLE IF NOT EXISTS roles (
  id_rol      SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  estado      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario     SERIAL PRIMARY KEY,
  id_rol         INT NOT NULL REFERENCES roles(id_rol),
  tipo_documento VARCHAR(5) NOT NULL,
  documento      VARCHAR(20) NOT NULL,
  nombres        VARCHAR(80) NOT NULL,
  apellidos      VARCHAR(80) NOT NULL,
  correo         VARCHAR(120) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  telefono       VARCHAR(20),
  especialidad   VARCHAR(100),
  estado         BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tipo_documento, documento)
);

CREATE TABLE IF NOT EXISTS pacientes (
  id_paciente      SERIAL PRIMARY KEY,
  tipo_documento   VARCHAR(5) NOT NULL,
  documento        VARCHAR(20) NOT NULL,
  nombres          VARCHAR(80) NOT NULL,
  apellidos        VARCHAR(80) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero           VARCHAR(1) NOT NULL,
  telefono         VARCHAR(20),
  correo           VARCHAR(120),
  direccion        VARCHAR(200),
  estado           BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (tipo_documento, documento)
);

CREATE TABLE IF NOT EXISTS medicamentos (
  id_medicamento   SERIAL PRIMARY KEY,
  codigo_cums      VARCHAR(30) NOT NULL UNIQUE,
  nombre_generico  VARCHAR(120) NOT NULL,
  nombre_comercial VARCHAR(120),
  tipo_medicamento VARCHAR(80),
  es_controlado    BOOLEAN NOT NULL DEFAULT FALSE,
  stock_minimo     INT NOT NULL DEFAULT 0,
  estado           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS via_administracion (
  id_via SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lotes_medicamento (
  id_lote         SERIAL PRIMARY KEY,
  id_medicamento  INT NOT NULL REFERENCES medicamentos(id_medicamento),
  id_via          INT NOT NULL REFERENCES via_administracion(id_via),
  id_presentacion INT NOT NULL,
  num_lote        VARCHAR(40) NOT NULL,
  fecha_vence     DATE NOT NULL,
  stock_actual    INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  UNIQUE (id_medicamento, num_lote)
);

CREATE TABLE IF NOT EXISTS orden_medica (
  id_orden       SERIAL PRIMARY KEY,
  id_usuario     INT NOT NULL REFERENCES usuarios(id_usuario),
  id_paciente    INT NOT NULL REFERENCES pacientes(id_paciente),
  detalles       TEXT,
  estado         VARCHAR(20) NOT NULL DEFAULT 'activa',
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalle_orden (
  id_detalle_orden   SERIAL PRIMARY KEY,
  id_orden           INT NOT NULL REFERENCES orden_medica(id_orden),
  id_medicamento     INT NOT NULL REFERENCES medicamentos(id_medicamento),
  id_via             INT NOT NULL REFERENCES via_administracion(id_via),
  id_presentacion    INT NOT NULL,
  frecuencia_horas   INT NOT NULL CHECK (frecuencia_horas > 0),
  total_aplicaciones INT NOT NULL CHECK (total_aplicaciones > 0),
  fecha_inicio       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  observaciones      TEXT
);

CREATE TABLE IF NOT EXISTS aplicacion (
  id_aplicacion         SERIAL PRIMARY KEY,
  id_detalle_orden      INT NOT NULL REFERENCES detalle_orden(id_detalle_orden),
  id_enfermero          INT REFERENCES usuarios(id_usuario),
  fecha_hora_programada TIMESTAMPTZ NOT NULL,
  fecha_hora_aplicacion TIMESTAMPTZ,
  estado                VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  observacion           TEXT
);

CREATE TABLE IF NOT EXISTS aplicacion_imagen (
  id_imagen     SERIAL PRIMARY KEY,
  id_aplicacion INT NOT NULL REFERENCES aplicacion(id_aplicacion),
  url           VARCHAR(500) NOT NULL,
  fecha         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dispensaciones (
  id_dispensacion    SERIAL PRIMARY KEY,
  id_detalle_orden   INT NOT NULL REFERENCES detalle_orden(id_detalle_orden),
  id_lote            INT NOT NULL REFERENCES lotes_medicamento(id_lote),
  id_farmaceuta      INT NOT NULL REFERENCES usuarios(id_usuario),
  cantidad_entregada INT NOT NULL CHECK (cantidad_entregada > 0),
  fecha_dispensacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auditoria_logs (
  id_log           SERIAL PRIMARY KEY,
  id_usuario       INT REFERENCES usuarios(id_usuario),
  accion           VARCHAR(40) NOT NULL,
  tabla_afectada   VARCHAR(60) NOT NULL,
  registro_id      INT,
  datos_anteriores JSONB,
  datos_nuevos     JSONB,
  direccion_ip     VARCHAR(60),
  fecha_hora       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aplicacion_estado ON aplicacion(estado, fecha_hora_programada);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_logs(fecha_hora DESC);
