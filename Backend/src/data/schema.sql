<<<<<<< HEAD

CREATE TABLE IF NOT EXISTS public.roles (

    id_rol      serial4      NOT NULL,

    nombre      varchar(50)  NOT NULL,

    descripcion varchar(200) NULL,

    estado      bool         DEFAULT true NOT NULL,

    CONSTRAINT roles_nombre_key UNIQUE (nombre),

    CONSTRAINT roles_pkey PRIMARY KEY (id_rol)

);



CREATE TABLE IF NOT EXISTS public.via_administracion (

    id_via serial4     NOT NULL,

    nombre varchar(50) NOT NULL,

    estado bool        DEFAULT true NOT NULL,

    CONSTRAINT via_administracion_nombre_key UNIQUE (nombre),

    CONSTRAINT via_administracion_pkey PRIMARY KEY (id_via)

);



CREATE TABLE IF NOT EXISTS public.presentacion (

    id_presentacion serial4        NOT NULL,

    nombre          varchar(50)    NOT NULL,

    cantidad        numeric(10, 2) NOT NULL,

    unidad          varchar(10)    NOT NULL,

    CONSTRAINT presentacion_cantidad_check CHECK ((cantidad > (0)::numeric)),

    CONSTRAINT presentacion_nombre_cantidad_unidad_key UNIQUE (nombre, cantidad, unidad),

    CONSTRAINT presentacion_pkey PRIMARY KEY (id_presentacion)

);



CREATE TABLE IF NOT EXISTS public.usuarios (

    id_usuario     serial4      NOT NULL,

    id_rol         int4         NOT NULL,

    tipo_documento varchar(10)  NOT NULL,

    documento      varchar(30)  NOT NULL,

    nombres        varchar(100) NOT NULL,

    apellidos      varchar(100) NOT NULL,

    correo         varchar(150) NOT NULL,

    password_hash  varchar(255) NOT NULL,

    telefono       varchar(20)  NULL,

    especialidad   varchar(100) NULL,

    estado         bool         DEFAULT true NOT NULL,

    fecha_creacion timestamp    DEFAULT now() NOT NULL,

    CONSTRAINT usuarios_correo_key UNIQUE (correo),

    CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario),

    CONSTRAINT usuarios_tipo_documento_documento_key UNIQUE (tipo_documento, documento),

    CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol)

);

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios USING btree (id_rol);



CREATE TABLE IF NOT EXISTS public.pacientes (

    id_paciente      serial4      NOT NULL,

    tipo_documento   varchar(10)  NOT NULL,

    documento        varchar(30)  NOT NULL,

    nombres          varchar(100) NOT NULL,

    apellidos        varchar(100) NOT NULL,

    fecha_nacimiento date         NOT NULL,

    genero           varchar(20)  NULL,

    telefono         varchar(20)  NULL,

    correo           varchar(150) NULL,

    direccion        varchar(200) NULL,

    estado           bool         DEFAULT true NOT NULL,

    CONSTRAINT pacientes_pkey PRIMARY KEY (id_paciente),

    CONSTRAINT pacientes_tipo_documento_documento_key UNIQUE (tipo_documento, documento)

);



CREATE TABLE IF NOT EXISTS public.medicamentos (

    id_medicamento   serial4      NOT NULL,

    codigo_cums      varchar(30)  NOT NULL,

    nombre_generico  varchar(150) NOT NULL,

    nombre_comercial varchar(150) NULL,

    tipo_medicamento varchar(50)  NULL,

    es_controlado    bool         DEFAULT false NOT NULL,

    stock_minimo     int4         DEFAULT 0 NOT NULL,

    estado           bool         DEFAULT true NOT NULL,

    CONSTRAINT medicamentos_codigo_cums_key UNIQUE (codigo_cums),

    CONSTRAINT medicamentos_pkey PRIMARY KEY (id_medicamento),

    CONSTRAINT medicamentos_stock_minimo_check CHECK ((stock_minimo >= 0))

);



CREATE TABLE IF NOT EXISTS public.lotes_medicamento (

    id_lote         serial4     NOT NULL,

    id_medicamento  int4        NOT NULL,

    id_via          int4        NOT NULL,

    id_presentacion int4        NOT NULL,

    num_lote        varchar(50) NOT NULL,

    fecha_vence     date        NOT NULL,

    stock_actual    int4        DEFAULT 0 NOT NULL,

    CONSTRAINT lotes_medicamento_id_medicamento_id_via_id_presentacion_num_key UNIQUE (id_medicamento, id_via, id_presentacion, num_lote),

    CONSTRAINT lotes_medicamento_pkey PRIMARY KEY (id_lote),

    CONSTRAINT lotes_medicamento_stock_actual_check CHECK ((stock_actual >= 0)),

    CONSTRAINT lotes_medicamento_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamentos(id_medicamento),

    CONSTRAINT lotes_medicamento_id_presentacion_fkey FOREIGN KEY (id_presentacion) REFERENCES public.presentacion(id_presentacion),

    CONSTRAINT lotes_medicamento_id_via_fkey FOREIGN KEY (id_via) REFERENCES public.via_administracion(id_via)

);

CREATE INDEX IF NOT EXISTS idx_lotes_medicamento ON public.lotes_medicamento USING btree (id_medicamento);

CREATE INDEX IF NOT EXISTS idx_lotes_vence ON public.lotes_medicamento USING btree (fecha_vence);


CREATE TABLE IF NOT EXISTS public.orden_medica (

    id_orden       serial4     NOT NULL,

    id_usuario     int4        NOT NULL,

    id_paciente    int4        NOT NULL,

    detalles       text        NULL,

    estado         varchar(20) DEFAULT 'activa'::character varying NOT NULL,

    fecha_creacion timestamp   DEFAULT now() NOT NULL,

    CONSTRAINT orden_medica_estado_check CHECK (((estado)::text = ANY ((ARRAY['activa'::character varying, 'finalizada'::character varying, 'cancelada'::character varying])::text[]))),

    CONSTRAINT orden_medica_pkey PRIMARY KEY (id_orden),

    CONSTRAINT orden_medica_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente),

    CONSTRAINT orden_medica_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)

);

CREATE INDEX IF NOT EXISTS idx_orden_medico   ON public.orden_medica USING btree (id_usuario);

CREATE INDEX IF NOT EXISTS idx_orden_paciente ON public.orden_medica USING btree (id_paciente);



CREATE TABLE IF NOT EXISTS public.detalle_orden (

    id_detalle_orden   serial4   NOT NULL,

    id_orden           int4      NOT NULL,

    id_medicamento     int4      NOT NULL,

    id_via             int4      NOT NULL,

    id_presentacion    int4      NOT NULL,

    frecuencia_horas   int4      NOT NULL,

    total_aplicaciones int4      NOT NULL,

    fecha_inicio       timestamp NOT NULL,

    observaciones      text      NULL,

    CONSTRAINT detalle_orden_frecuencia_horas_check CHECK ((frecuencia_horas > 0)),

    CONSTRAINT detalle_orden_pkey PRIMARY KEY (id_detalle_orden),

    CONSTRAINT detalle_orden_total_aplicaciones_check CHECK ((total_aplicaciones > 0)),

    CONSTRAINT detalle_orden_id_medicamento_fkey FOREIGN KEY (id_medicamento) REFERENCES public.medicamentos(id_medicamento),

    CONSTRAINT detalle_orden_id_orden_fkey FOREIGN KEY (id_orden) REFERENCES public.orden_medica(id_orden) ON DELETE CASCADE,

    CONSTRAINT detalle_orden_id_presentacion_fkey FOREIGN KEY (id_presentacion) REFERENCES public.presentacion(id_presentacion),

    CONSTRAINT detalle_orden_id_via_fkey FOREIGN KEY (id_via) REFERENCES public.via_administracion(id_via)

);

CREATE INDEX IF NOT EXISTS idx_detalle_orden ON public.detalle_orden USING btree (id_orden);



CREATE TABLE IF NOT EXISTS public.aplicacion (

    id_aplicacion         serial4     NOT NULL,

    id_detalle_orden      int4        NOT NULL,

    id_enfermero          int4        NULL,

    fecha_hora_programada timestamp   NOT NULL,

    fecha_hora_aplicacion timestamp   NULL,

    estado                varchar(20) DEFAULT 'pendiente'::character varying NOT NULL,

    observacion           text        NULL,

    CONSTRAINT aplicacion_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'administrada'::character varying, 'omitida'::character varying])::text[]))),

    CONSTRAINT aplicacion_pkey PRIMARY KEY (id_aplicacion),

    CONSTRAINT aplicacion_id_detalle_orden_fkey FOREIGN KEY (id_detalle_orden) REFERENCES public.detalle_orden(id_detalle_orden) ON DELETE CASCADE,

    CONSTRAINT aplicacion_id_enfermero_fkey FOREIGN KEY (id_enfermero) REFERENCES public.usuarios(id_usuario)

);

CREATE INDEX IF NOT EXISTS idx_aplicacion_detalle    ON public.aplicacion USING btree (id_detalle_orden);

CREATE INDEX IF NOT EXISTS idx_aplicacion_estado     ON public.aplicacion USING btree (estado, fecha_hora_programada);

CREATE INDEX IF NOT EXISTS idx_aplicacion_pendientes ON public.aplicacion USING btree (id_enfermero, estado, fecha_hora_programada);



CREATE TABLE IF NOT EXISTS public.aplicacion_imagen (

    id_imagen     serial4      NOT NULL,

    id_aplicacion int4         NOT NULL,

    url           varchar(500) NOT NULL,

    fecha         timestamp    DEFAULT now() NOT NULL,

    CONSTRAINT aplicacion_imagen_pkey PRIMARY KEY (id_imagen),

    CONSTRAINT aplicacion_imagen_id_aplicacion_fkey FOREIGN KEY (id_aplicacion) REFERENCES public.aplicacion(id_aplicacion) ON DELETE CASCADE

);



CREATE TABLE IF NOT EXISTS public.dispensaciones (

    id_dispensacion    serial4   NOT NULL,

    id_detalle_orden   int4      NOT NULL,

    id_lote            int4      NOT NULL,

    id_farmaceuta      int4      NOT NULL,

    cantidad_entregada int4      NOT NULL,

    fecha_dispensacion timestamp DEFAULT now() NOT NULL,

    CONSTRAINT dispensaciones_cantidad_entregada_check CHECK ((cantidad_entregada > 0)),

    CONSTRAINT dispensaciones_pkey PRIMARY KEY (id_dispensacion),

    CONSTRAINT dispensaciones_id_detalle_orden_fkey FOREIGN KEY (id_detalle_orden) REFERENCES public.detalle_orden(id_detalle_orden),

    CONSTRAINT dispensaciones_id_lote_fkey FOREIGN KEY (id_lote) REFERENCES public.lotes_medicamento(id_lote),

    CONSTRAINT dispensaciones_id_farmaceuta_fkey FOREIGN KEY (id_farmaceuta) REFERENCES public.usuarios(id_usuario)

);



CREATE TABLE IF NOT EXISTS public.auditoria_logs (

    id_log           serial4     NOT NULL,

    id_usuario       int4        NULL,

    accion           varchar(50) NOT NULL,

    tabla_afectada   varchar(80) NOT NULL,

    registro_id      int4        NULL,

    datos_anteriores jsonb       NULL,

    datos_nuevo      jsonb       NULL,

    direccion_ip     varchar(45) NULL,

    fecha_hora       timestamp   DEFAULT now() NOT NULL,

    CONSTRAINT auditoria_logs_pkey PRIMARY KEY (id_log),

    CONSTRAINT auditoria_logs_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)

);

CREATE INDEX IF NOT EXISTS idx_auditoria_fecha   ON public.auditoria_logs USING btree (fecha_hora DESC);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON public.auditoria_logs USING btree (id_usuario, fecha_hora);



INSERT INTO public.roles (nombre, descripcion) VALUES

    ('Administrador', 'Gestión de usuarios, roles y auditoría'),

    ('Médico',        'Crea órdenes médicas'),

    ('Enfermero Jefe','Revisa órdenes y asigna enfermeros'),

    ('Enfermero',     'Administra los medicamentos a los pacientes'),

    ('Farmacéutico',  'Gestiona lotes y dispensaciones')

ON CONFLICT (nombre) DO NOTHING;


INSERT INTO public.via_administracion (nombre) VALUES

    ('Oral'), ('Intramuscular'), ('Intravenosa'), ('Subcutánea'),

    ('Tópica'), ('Inhalatoria'), ('Sublingual'), ('Rectal')

ON CONFLICT (nombre) DO NOTHING;


INSERT INTO public.presentacion (nombre, cantidad, unidad) VALUES

    ('tableta',   1000, 'mg'),

    ('tableta',    500, 'mg'),

    ('inyección',   10, 'cc'),

    ('pomada',      30, 'g'),

    ('spray',      100, 'ml')

ON CONFLICT (nombre, cantidad, unidad) DO NOTHING;

=======
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
>>>>>>> ac915a2e15800178d8ba060e2f7e5cb95088d461
