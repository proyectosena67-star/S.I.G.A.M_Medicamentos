# SIGAM API (Backend)

Node.js + Express + TypeScript + PostgreSQL.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env  (y edita DB_PASSWORD y JWT_SECRET)
npm run seed             # verifica tablas, crea roles, vías y el administrador inicial
npm run dev              # http://localhost:3000/api
```
Producción: `npm run build` y `npm start`.

## Estructura (src/)
| Carpeta | Contenido |
|---|---|
| config/ | variables de entorno y constantes (roles, estados) |
| data/ | conexión a PostgreSQL, transacciones, `schema.sql` y `seed.ts` |
| models/ | interfaces de cada entidad |
| dtos/ | esquemas zod: qué datos se aceptan en cada petición |
| repositories/ | consultas SQL |
| services/ | reglas de negocio |
| controllers/ | reciben la petición y responden |
| middlewares/ | autenticación, roles, validación, auditoría, errores |
| errors/ | errores HTTP propios y traducción de errores de PostgreSQL |
| routes/ | rutas de cada módulo + `index.ts` |
| app.ts / server.ts | configuración de Express / arranque |

Cada entidad tiene su propio `*.model`, `*.dto`, `*.repository`, `*.service`, `*.controller`, `*.middleware` y `*.routes`.

## Rutas (base `/api`)
- `GET /health`
- `POST /auth/login` · `GET /auth/me` · `POST /auth/cambiar-password`
- `/usuarios` (+ `GET /usuarios/enfermeros`, `PATCH /usuarios/:id/estado`) — Administrador
- `/roles` — Administrador
- `/pacientes`, `/medicamentos`, `/vias-administracion`, `/lotes` (+ `PATCH /:id/estado` donde aplica)
- `/ordenes` (+ `GET /ordenes/:id/medicamentos`, `PATCH /ordenes/:id/estado`)
- `/aplicaciones` (+ `PATCH /:id/asignar`, `PATCH /:id/registrar`, `POST /:id/imagenes`)
- `/dispensaciones`
- `/auditoria` — Administrador

## Crear una orden (Médico)
```json
POST /ordenes
{
  "id_paciente": 1,
  "detalles": "Control de dolor postoperatorio",
  "medicamentos": [
    { "id_medicamento": 1, "id_via": 1, "id_presentacion": 1,
      "frecuencia_horas": 8, "total_aplicaciones": 6, "observaciones": "Con alimentos" }
  ]
}
```
Al crearla se programan automáticamente las 6 aplicaciones (una cada 8 horas).
