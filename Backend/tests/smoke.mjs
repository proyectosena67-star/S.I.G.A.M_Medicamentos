// Prueba de humo de punta a punta. Requisitos: servidor en marcha (npm run dev) y base recién sembrada (npm run db:reset).
// Usa la contraseña definida en SEED_PASSWORD (por defecto "Prueba2026" si no está definida).
const B = process.env.API_URL ?? 'http://localhost:3000/api';
const PASS = process.env.SEED_PASSWORD ?? 'Prueba2026';
let fallos = 0;
async function call(method, path, token, body) {
  const r = await fetch(B + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null; try { data = await r.json(); } catch {}
  return { s: r.status, d: data };
}
function esperar(nombre, cond, extra = '') {
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre} ${cond ? '' : extra}`);
  if (!cond) fallos++;
}
const login = async (correo) => (await call('POST', '/auth/login', null, { correo, password: PASS })).d.token;

(async () => {
  // --- HU-02 login
  let r = await call('POST', '/auth/login', null, { correo: 'admin@sigap.com', password: 'mala' });
  esperar('login con clave incorrecta -> 401', r.s === 401 && r.d.error.includes('incorrectos'), JSON.stringify(r));
  const admin = await login('admin@sigap.com');
  const medico = await login('carlos.mendez@sigap.com');
  const farma = await login('camilo.pardo@sigap.com');
  const enf = await login('laura.londono@sigap.com');
  esperar('login exitoso de 4 roles', admin && medico && farma && enf);

  // --- control de acceso por rol
  r = await call('GET', '/usuarios', enf);
  esperar('enfermería no puede listar usuarios -> 403', r.s === 403, JSON.stringify(r));
  r = await call('GET', '/usuarios');
  esperar('sin token -> 401', r.s === 401);

  // --- HU-01 crear usuario
  r = await call('POST', '/usuarios', admin, { id_rol: 3, tipo_documento: 'CC', documento: '777', nombres: 'Nuevo', apellidos: 'Usuario', correo: 'nuevo@sigap.com' });
  esperar('crear usuario -> 201 con contraseña temporal', r.s === 201 && r.d.credenciales?.password_temporal, JSON.stringify(r));
  const temp = r.d.credenciales?.password_temporal;
  r = await call('POST', '/usuarios', admin, { id_rol: 3, tipo_documento: 'CC', documento: '777', nombres: 'Nuevo', apellidos: 'Usuario', correo: 'otro@sigap.com' });
  esperar('usuario duplicado -> 409', r.s === 409, JSON.stringify(r));
  r = await call('POST', '/usuarios', admin, { nombres: 'x' });
  esperar('datos faltantes -> 400 con campos', r.s === 400 && r.d.errores?.length > 3, JSON.stringify(r));
  r = await call('POST', '/auth/login', null, { correo: 'nuevo@sigap.com', password: temp });
  esperar('el nuevo usuario entra con la clave temporal', r.s === 200, JSON.stringify(r));
  const idNuevo = (await call('GET', '/usuarios?q=nuevo@', admin)).d[0].id_usuario;
  await call('PATCH', `/usuarios/${idNuevo}/estado`, admin, { estado: false });
  r = await call('POST', '/auth/login', null, { correo: 'nuevo@sigap.com', password: temp });
  esperar('usuario desactivado -> 403 "Usuario inactivo"', r.s === 403 && r.d.error === 'Usuario inactivo', JSON.stringify(r));

  // --- HU-05 pacientes
  r = await call('POST', '/pacientes', admin, { tipo_documento: 'CC', documento: '2000000001', nombres: 'Dup', apellidos: 'Dup' });
  esperar('paciente duplicado -> 409 "ya está registrado"', r.s === 409 && r.d.error.includes('ya está registrado'), JSON.stringify(r));
  r = await call('POST', '/pacientes', admin, { tipo_documento: 'CC', documento: '2000000002', nombres: 'Ana', apellidos: 'Gómez', fecha_nacimiento: '1990-05-01' });
  esperar('registrar paciente -> "Registro exitoso"', r.s === 201 && r.d.mensaje === 'Registro exitoso', JSON.stringify(r));
  r = await call('GET', '/pacientes?q=Gómez', medico);
  esperar('médico busca pacientes', r.s === 200 && r.d.length === 1 && r.d[0].fecha_nacimiento === '1990-05-01', JSON.stringify(r));

  // --- HU-09 orden médica
  r = await call('POST', '/ordenes', farma, { id_paciente: 1, items: [{ id_medicamento: 1, cantidad: 5 }] });
  esperar('farmacéutico no puede crear órdenes -> 403', r.s === 403);
  r = await call('POST', '/ordenes', medico, { id_paciente: 1, tipo_orden: 'Medicamentos', items: [{ id_medicamento: 1, cantidad: 10, tiempo: 'cada 8 horas' }, { id_medicamento: 2, cantidad: 4, tiempo: 'noche' }] });
  esperar('médico crea orden con 2 medicamentos', r.s === 201 && r.d.items?.length === 2 && r.d.estado === 'Activa', JSON.stringify(r));
  const orden = r.d.id_orden; const [lin1, lin2] = r.d.items.map((i) => i.id_detalle_orden);
  r = await call('POST', '/ordenes', medico, { id_paciente: 1, items: [{ id_medicamento: 1, cantidad: 0 }] });
  esperar('cantidad 0 -> 400', r.s === 400, JSON.stringify(r));

  // --- HU-10 dispensación
  r = await call('GET', '/dispensaciones/pendientes', farma);
  esperar('farmacia ve 2 líneas pendientes', r.s === 200 && r.d.length === 2, JSON.stringify(r));
  const lotes = (await call('GET', '/lotes', farma)).d;
  const lote1 = lotes.find((l) => l.id_medicamento === 1).id_lote;
  const lote2 = lotes.find((l) => l.id_medicamento === 2).id_lote;
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin1, id_lote: lote2, cantidad_entregada: 5 });
  esperar('lote de otro medicamento -> 409', r.s === 409, JSON.stringify(r));
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin1, id_lote: lote1, cantidad_entregada: 11 });
  esperar('excede lo prescrito -> 409', r.s === 409 && r.d.error.includes('Excede'), JSON.stringify(r));
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin2, id_lote: lote2, cantidad_entregada: 4 });
  esperar('controlado sin confirmar -> 400 requiere_confirmacion', r.s === 400 && r.d.requiere_confirmacion === true, JSON.stringify(r));
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin2, id_lote: lote2, cantidad_entregada: 4, confirmar_controlado: true });
  esperar('controlado confirmado -> 201', r.s === 201, JSON.stringify(r));
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin1, id_lote: lote1, cantidad_entregada: 10 });
  esperar('dispensar 10 -> 201', r.s === 201, JSON.stringify(r));
  r = await call('GET', '/lotes?id_medicamento=1', farma);
  esperar('stock del lote bajó de 100 a 90', r.d[0].stock_actual === 90, JSON.stringify(r.d));

  // --- HU-11 aplicación
  r = await call('POST', '/aplicaciones', medico, { id_detalle_orden: lin1 });
  esperar('médico no puede aplicar -> 403', r.s === 403);
  r = await call('POST', '/aplicaciones', enf, { id_detalle_orden: lin1, via_administracion: 'Intravenosa' });
  esperar('vía distinta sin observación -> 400 alerta', r.s === 400 && r.d.alerta === true, JSON.stringify(r));
  r = await call('POST', '/aplicaciones', enf, { id_detalle_orden: lin1, via_administracion: 'Intravenosa', observacion: 'Paciente sin acceso oral' });
  esperar('vía distinta con justificación -> 201 + alerta', r.s === 201 && r.d.alerta, JSON.stringify(r));
  r = await call('POST', '/aplicaciones', enf, { id_detalle_orden: lin1 });
  esperar('aplicación normal usa la vía del medicamento', r.s === 201 && r.d.aplicacion.via_administracion === 'Oral' && !r.d.alerta, JSON.stringify(r));

  // --- editar / cancelar orden
  r = await call('PUT', `/ordenes/${orden}`, medico, { detalles: 'x' });
  esperar('editar sin justificación -> 400', r.s === 400);
  r = await call('PUT', `/ordenes/${orden}`, medico, { justificacion: 'ajuste', items: [{ id_medicamento: 1, cantidad: 3 }] });
  esperar('cambiar medicamentos con dispensaciones -> 409', r.s === 409, JSON.stringify(r));
  r = await call('PUT', `/ordenes/${orden}`, medico, { justificacion: 'aclaración', detalles: 'Observar al paciente' });
  esperar('editar detalles con justificación -> 200', r.s === 200 && r.d.detalles === 'Observar al paciente', JSON.stringify(r));
  r = await call('PATCH', `/ordenes/${orden}/estado`, medico, { estado: 'Cancelada', justificacion: 'Cambio de tratamiento' });
  esperar('cancelar orden -> 200', r.s === 200 && r.d.estado === 'Cancelada', JSON.stringify(r));
  r = await call('POST', '/aplicaciones', enf, { id_detalle_orden: lin1 });
  esperar('aplicar sobre orden cancelada -> 409', r.s === 409, JSON.stringify(r));
  r = await call('POST', '/dispensaciones', farma, { id_detalle_orden: lin1, id_lote: lote1, cantidad_entregada: 1 });
  esperar('dispensar sobre orden cancelada -> 409', r.s === 409, JSON.stringify(r));

  // --- historial / alertas / detalle
  r = await call('GET', '/pacientes/1/historial', medico);
  const it = r.d.ordenes?.[0]?.items?.[0];
  esperar('historial trae orden, dispensaciones y aplicaciones', r.s === 200 && it && it.dispensaciones.length === 1 && it.aplicaciones_registradas.length === 2, JSON.stringify(r).slice(0, 300));
  r = await call('GET', '/lotes/alertas', farma);
  esperar('alertas de stock', r.s === 200 && Array.isArray(r.d.stock_bajo), JSON.stringify(r));
  r = await call('GET', `/detalle-orden?id_orden=${orden}`, farma);
  esperar('detalle-orden lista las líneas', r.s === 200 && r.d.length === 2, JSON.stringify(r));
  r = await call('GET', '/medicamentos', enf);
  esperar('medicamentos con stock_total', r.s === 200 && r.d.find((m) => m.id_medicamento === 2).stock_total === 96, JSON.stringify(r.d));

  // --- HU-04 perfil
  r = await call('PUT', '/auth/password', enf, { actual: PASS, nueva: 'corta' });
  esperar('contraseña débil -> 400', r.s === 400, JSON.stringify(r));
  r = await call('PUT', '/auth/perfil', enf, { telefono: '3001234567' });
  esperar('editar teléfono del perfil', r.s === 200 && r.d.perfil.telefono === '3001234567', JSON.stringify(r));

  // --- HU-12 auditoría
  r = await call('GET', '/auditoria?limit=500', enf);
  esperar('enfermería no ve auditoría -> 403', r.s === 403);
  r = await call('GET', '/auditoria?limit=500', admin);
  const acciones = new Set(r.d.registros.map((x) => x.accion));
  esperar('auditoría registró LOGIN, CREATE, DISPENSAR, APLICAR, CANCELAR', ['LOGIN', 'CREATE', 'DISPENSAR', 'APLICAR', 'CANCELAR', 'UPDATE'].every((a) => acciones.has(a)), [...acciones].join(','));
  const todo = JSON.stringify(r.d.registros);
  esperar('auditoría no contiene contraseñas ni hashes', !todo.includes('password_hash') && !todo.includes(temp) && !todo.includes('$2a$'));
  r = await call('GET', '/auditoria?tabla=orden_medica&accion=UPDATE', admin);
  const upd = r.d.registros[0];
  esperar('UPDATE de orden guarda anteriores, nuevos y justificación', upd && upd.datos_anteriores && upd.datos_nuevo.includes('aclaración'), JSON.stringify(upd));

  r = await call('GET', '/usuarios/abc', admin);
  esperar('id no numérico -> 400', r.s === 400);
  r = await call('GET', '/ruta-inexistente', admin);
  esperar('ruta inexistente -> 404', r.s === 404);

  console.log(fallos ? `\n${fallos} PRUEBA(S) FALLARON` : '\nTODAS LAS PRUEBAS PASARON');
})();
