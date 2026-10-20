# S.I.G.A.M. — Backend (TypeScript + Express + PostgreSQL)

Backend alineado con el modelo de datos de 10 tablas: `roles`, `usuarios`, `pacientes`, `medicamentos`,
`lotes_medicamento`, `orden_medica`, `detalle_orden`, `dispensaciones`, `aplicacion` y `auditoria_logs`.

## Puesta en marcha

```powershell
npm install
copy .env.example .env        # y editar JWT_SECRET y los datos de PostgreSQL
psql -U postgres -c "CREATE DATABASE sigam;"
npm run db:reset              # crea las 10 tablas, roles, usuarios y datos de prueba
npm run dev                   # API en http://localhost:3000
```

- `npm run db:reset` **borra y recrea** las tablas. Para sembrar sin borrar: `npm run seed`.
- La contraseña de los usuarios de prueba sale de `SEED_PASSWORD` (en `.env`). Si no la definen, el seed genera
  una al azar y la imprime una sola vez. No hay contraseñas fijas en el código.
- Opcional: `Backend/sql/auditoria_inmutable.sql` impide editar o borrar `auditoria_logs` incluso con SQL directo.
- Producción: `npm run build` y luego `npm start`.
- Prueba de humo (46 comprobaciones del flujo completo): con el servidor en marcha y la base recién sembrada,
  `npm run test:smoke`.

## Estructura

```
Backend/
├── sql/                 schema.sql (las 10 tablas) y auditoria_inmutable.sql (opcional)
├── tests/               smoke.mjs
└── src/
    ├── config/          env.ts, db.ts (pool + transacciones)
    ├── models/          una interfaz por tabla (Rol, Usuario, Paciente, Medicamento, LoteMedicamento,
    │                    OrdenMedica, DetalleOrden, Dispensacion, Aplicacion, AuditoriaLog)
    ├── dtos/            validación de entrada (zod), mensajes en español
    ├── data/            repositorios: todo el SQL, uno por tabla
    ├── services/        lógica de negocio (transacciones, alertas, auditoría)
    ├── controllers/     reciben la petición, validan el DTO y llaman al servicio
    ├── routes/          rutas y permisos por rol
    ├── middlewares/     auth (JWT), rol, params, error
    ├── errors/          AppError y errores HTTP tipados
    ├── types/           AuthUser y ampliación de Express.Request
    ├── utils/           asyncHandler, nombres de roles
    ├── app.ts           configuración de Express
    ├── server.ts        arranque (verifica .env y conexión a PostgreSQL)
    └── seed.ts          roles, usuarios y datos de ejemplo
```

## Cómo integrarlo en el repositorio existente (SIGAM-copia)

1. Crear una rama: `git checkout -b refactor-modelo-bd`.
2. Mover lo que ya no está en el alcance a `Backend/_legacy/` con `git mv`: bdua, cita, factura, rips, triage,
   dian.config y los archivos de `routes`, `services`, `repositories` y `models` con esos nombres.
3. Copiar el contenido de este zip sobre la raíz del repositorio. Si ya tienen `package.json`, no lo
   reemplacen: instalen las dependencias y agreguen los scripts.
   ```powershell
   npm install express pg bcryptjs jsonwebtoken dotenv cors zod
   npm install -D typescript tsx @types/node @types/express @types/pg @types/bcryptjs @types/jsonwebtoken @types/cors
   ```
4. Agregar `.env` al `.gitignore`.

## Endpoints (todos bajo `/api`)

| Historia | Endpoint | Rol |
|---|---|---|
| HU-01 | `/usuarios`, `/roles` (CRUD, `PATCH /:id/estado`, `POST /usuarios/:id/restablecer-password`) | Administrador |
| HU-02 / 03 | `POST /auth/login`, `POST /auth/logout` | Todos |
| HU-04 | `GET/PUT /auth/perfil`, `PUT /auth/password` | Todos |
| HU-05 / 06 | `/pacientes`, `GET /pacientes/:id/historial` | Admin (edita), Médico, Enfermería, Psicología (consultan) |
| HU-07 | `/medicamentos` | Administrador, Farmacéutico (gestionan); todos consultan |
| HU-08 | `/lotes`, `GET /lotes/alertas` | Farmacéutico |
| HU-09 | `/ordenes`, `PUT /ordenes/:id`, `PATCH /ordenes/:id/estado`, `/detalle-orden` (consulta) | Médico |
| HU-10 | `GET /dispensaciones/pendientes`, `POST /dispensaciones` | Farmacéutico |
| HU-11 | `GET /aplicaciones/pendientes`, `POST /aplicaciones` | Enfermería |
| HU-12 | `GET /auditoria?tabla=&accion=&id_usuario=&desde=&hasta=` | Administrador |

Las líneas de `detalle_orden` se crean y modifican a través de la orden; `/detalle-orden` solo las consulta.

## Reglas de negocio que implementa

- **Dispensación**: transacción con bloqueo de filas (`FOR UPDATE`); valida orden activa, lote del mismo
  medicamento, lote no vencido, stock suficiente y que no se supere la cantidad prescrita. Los medicamentos
  controlados piden confirmación (`confirmar_controlado: true`). Dos dispensaciones simultáneas no se pisan.
- **Aplicación**: solo sobre órdenes activas con medicamento dispensado; si la vía difiere de la del medicamento,
  exige justificación en `observacion` y devuelve una alerta.
- **Órdenes**: solo el médico crea, modifica o cancela; modificar o cancelar exige justificación y queda en
  auditoría con datos anteriores y nuevos. No se pueden cambiar los medicamentos si ya hay movimientos.
- **Auditoría**: LOGIN, LOGOUT, CREATE, UPDATE, ACTIVAR/DESACTIVAR, CANCELAR/FINALIZAR, DISPENSAR, APLICAR,
  CAMBIO_PASSWORD. Nunca guarda contraseñas ni hashes.
- **Sesión**: el token se revalida contra la base en cada petición; si el administrador desactiva a un
  usuario o a su rol, pierde el acceso de inmediato.

## Lo que el modelo actual no permite (queda fuera)

- Cambio obligatorio de la contraseña temporal (HU-01 CA3 / HU-02 CA5): requiere una columna
  `cambio_password_pendiente` en `usuarios`.
- Dosis, frecuencia y fechas estructuradas en las órdenes, y por tanto horarios automáticos y vencimiento
  de órdenes por fecha: requieren columnas en `detalle_orden`.
- Recuperación de contraseña por correo, historia clínica, peticiones de enfermería, visitas, planes e
  incidentes: requieren tablas nuevas (fases futuras). Mientras tanto, el administrador puede restablecer una
  contraseña con `POST /usuarios/:id/restablecer-password`.
