-- OPCIONAL: ejecutar después de schema.sql. Hace auditoria_logs de solo inserción
-- (HU-12 CA5: nadie puede editar ni eliminar registros de auditoría, ni siquiera con SQL directo).
CREATE OR REPLACE FUNCTION auditoria_bloquear_cambios() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'auditoria_logs es de solo inserción';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auditoria_inmutable ON auditoria_logs;
CREATE TRIGGER trg_auditoria_inmutable
BEFORE UPDATE OR DELETE ON auditoria_logs
FOR EACH ROW EXECUTE FUNCTION auditoria_bloquear_cambios();
