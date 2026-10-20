-- S.I.G.A.M. - Target: PostgreSQL

DROP TABLE IF EXISTS auditoria_logs CASCADE;
DROP TABLE IF EXISTS aplicacion CASCADE;
DROP TABLE IF EXISTS dispensaciones CASCADE;
DROP TABLE IF EXISTS detalle_orden CASCADE;
DROP TABLE IF EXISTS orden_medica CASCADE;
DROP TABLE IF EXISTS lotes_medicamento CASCADE;
DROP TABLE IF EXISTS medicamentos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. Tabla de Roles
CREATE TABLE roles (
id_rol SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE,
descripcion TEXT,
estado BOOLEAN DEFAULT TRUE
);

-- 2. Tabla de Usuarios
CREATE TABLE usuarios (
id_usuario SERIAL PRIMARY KEY,
id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
tipo_documento VARCHAR(20) NOT NULL,
documento VARCHAR(30) NOT NULL UNIQUE,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
correo VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
telefono VARCHAR(30),
especialidad VARCHAR(100),
estado BOOLEAN DEFAULT TRUE,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Pacientes
CREATE TABLE pacientes (
id_paciente SERIAL PRIMARY KEY,
tipo_documento VARCHAR(20) NOT NULL,
documento VARCHAR(30) NOT NULL UNIQUE,
nombres VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
fecha_nacimiento DATE,
genero VARCHAR(20),
telefono VARCHAR(30),
correo VARCHAR(100),
direccion TEXT,
estado BOOLEAN DEFAULT TRUE
);

-- 4. Tabla de Medicamentos
CREATE TABLE medicamentos (
id_medicamento SERIAL PRIMARY KEY,
codigo_cums VARCHAR(50) UNIQUE,
nombre_generico VARCHAR(150) NOT NULL,
nombre_comercial VARCHAR(150),
presentacion VARCHAR(100),
concentracion VARCHAR(100),
via_administracion VARCHAR(100),
tipo_medicamento VARCHAR(100),
es_controlado BOOLEAN DEFAULT FALSE,
stock_minimo INTEGER DEFAULT 0,
estado BOOLEAN DEFAULT TRUE
);

-- 5. Tabla de Lotes de Medicamento
CREATE TABLE lotes_medicamento (
id_lote SERIAL PRIMARY KEY,
id_medicamento INTEGER NOT NULL REFERENCES medicamentos(id_medicamento) ON DELETE CASCADE,
num_lote VARCHAR(50) NOT NULL,
fecha_vence DATE NOT NULL,
stock_actual INTEGER NOT NULL CHECK (stock_actual >= 0)
);

-- 6. Tabla de Orden Médica
CREATE TABLE orden_medica (
id_orden SERIAL PRIMARY KEY,
id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
id_paciente INTEGER NOT NULL REFERENCES pacientes(id_paciente),
tipo_orden VARCHAR(50),
detalles TEXT,
estado VARCHAR(30) DEFAULT 'Activa',
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Detalle de Orden (Dosificación)
CREATE TABLE detalle_orden (
id_detalle_orden SERIAL PRIMARY KEY,
id_orden INTEGER NOT NULL REFERENCES orden_medica(id_orden) ON DELETE CASCADE,
id_medicamento INTEGER NOT NULL REFERENCES medicamentos(id_medicamento),
cantidad INTEGER NOT NULL CHECK (cantidad > 0),
tiempo VARCHAR(100),
observaciones TEXT
);

-- 8. Tabla de Dispensaciones
CREATE TABLE dispensaciones (
id_dispensacion SERIAL PRIMARY KEY,
id_detalle_orden INTEGER NOT NULL REFERENCES detalle_orden(id_detalle_orden),
id_lote INTEGER NOT NULL REFERENCES lotes_medicamento(id_lote),
id_farmaceuta INTEGER NOT NULL REFERENCES usuarios(id_usuario),
cantidad_entregada INTEGER NOT NULL CHECK (cantidad_entregada > 0),
fecha_dispensacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Aplicación
CREATE TABLE aplicacion (
id_aplicacion SERIAL PRIMARY KEY,
id_detalle_orden INTEGER NOT NULL REFERENCES detalle_orden(id_detalle_orden),
id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
fecha_hora_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
via_administracion VARCHAR(100),
observacion TEXT
);

-- 10. Tabla de Auditoría (Logs)
CREATE TABLE auditoria_logs (
id_log SERIAL PRIMARY KEY,
id_usuario INTEGER REFERENCES usuarios(id_usuario),
accion VARCHAR(20) NOT NULL,
tabla_afectada VARCHAR(100) NOT NULL,
registro_id INTEGER,
datos_anteriores TEXT,
datos_nuevo TEXT,
direccion_ip VARCHAR(50),
fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados para optimización de consultas frecuentes
CREATE INDEX idx_usuarios_documento ON usuarios(documento);
CREATE INDEX idx_pacientes_documento ON pacientes(documento);
CREATE INDEX idx_medicamentos_nombre ON medicamentos(nombre_generico);
CREATE INDEX idx_lotes_medicamento ON lotes_medicamento(id_medicamento);
CREATE INDEX idx_orden_medica_paciente ON orden_medica(id_paciente);
