# Spec — Ventas del día a día (rebanada)

Dueño de PyME: ver cómo vienen las ventas de un período y cargar movimientos (uno o por CSV). El front solo habla con la API.

## Alcance

- Alta individual y carga CSV, validación, persistencia SQL **idempotente**, consolidado del período, detalle paginado, pantalla con números + 2 gráficos.
- **Fuera:** auth, editar/borrar, cache, async, paginación cursor, multi-empresa, otros gráficos, Nest, Postgres.

## Dominio

Una venta: `id_venta`, `fecha`, `cliente`, `producto`, `cantidad`, `importe`, `medio_pago`.

| Campo | Regla |
|---|---|
| todos | requeridos (7) |
| `id_venta` | no vacío (trim) |
| `fecha` | `YYYY-MM-DD` válida |
| `cantidad` | entero ≥ 1 |
| `importe` | ≥ 0, **total de línea** (no unitario) |
| `medio_pago` | `efectivo` \| `tarjeta` \| `transferencia` |

**Plata:** API en pesos (número). SQLite en **centavos enteros**.

**Idempotencia:** clave `id_venta`. El primero gana. No duplicar. No actualizar. Mismo id con datos distintos = conflicto (no se pisa).

Un solo caso de uso: `registrarVentas(ventas[])`. El form es una lista de 1. El CSV se parsea a la misma lista.

## Mensajes

Catálogo único (`codigo` + `mensaje`). El service devuelve el código; el controller mapea HTTP. El front muestra `mensaje`, no inventa copy. El GET **no** lleva mensaje.

**Error** (400 / 409): `{ codigo, mensaje }`

**Alta ok** (201): `{ codigo, mensaje, venta }`  
**CSV ok** (200): `{ codigo, mensaje, insertadas, omitidas, invalidas }`

| codigo | HTTP | mensaje |
|---|---|---|
| `VENTA_CREADA` | 201 | Venta {id} guardada. |
| `VENTA_EXISTENTE` | 409 | Ya existe una venta con el id {id}. No se guardó de nuevo. |
| `VENTA_INVALIDA` | 400 | {motivo de validación} |
| `REQUEST_INVALIDO` | 400 | El cuerpo no se pudo leer. |
| `CARGA_PROCESADA` | 200 | {n} insertadas, {n} omitidas, {n} inválidas. |
| `CSV_INVALIDO` | 400 | Archivo ilegible, sin header, formato no soportado o mayor a 1 MB. |

`invalidas[]`: `{ fila, id_venta, motivo }` (motivo de fila, no el catálogo HTTP).

## HTTP

### `POST /ventas`
Body: **una** venta (no array). Interno: `registrarVentas([venta])`.

- insertada → `201` + `VENTA_CREADA`
- id existente → `409` + `VENTA_EXISTENTE`
- inválida → `400` + `VENTA_INVALIDA`
- JSON ilegible → `400` + `REQUEST_INVALIDO`

### `POST /ventas/csv`
Multipart, archivo ≤ 1 MB, UTF-8. Parser → `ventas[]` → **el mismo** service.

Carga **parcial**. Header obligatorio igual a la muestra (`id_venta,fecha,cliente,producto,cantidad,importe,medio_pago`). Columnas de más se ignoran; de menos = fila inválida. Duplicado **dentro** del archivo: primera gana, resto omitida.

- archivo legible → `200` + `CARGA_PROCESADA` (aunque haya filas malas o 0 insertadas)
- archivo ilegible / sin header / formato desconocido / > 1 MB → `400` + `CSV_INVALIDO`

Nunca 409 de todo el lote.

### `GET /ventas/consolidado?desde=&hasta=`
Fechas inclusive. Sin fechas → todo lo cargado. Sin `mensaje`. Todo el período; no recibe `pagina`.

```
{
  total,              // pesos
  cantidad,           // ventas del período
  por_medio_pago: [{ medio_pago, total, cantidad }],
  por_dia: [{ fecha, total, cantidad }]
}
```

### `GET /ventas?desde=&hasta=&pagina=1&por_pagina=20`
Mismo filtro de fechas. Solo detalle. `pagina` default 1. `por_pagina` default 20, máx 100. Offset, más reciente primero, desempate `id_venta`. **No** incluye consolidado.

```
{
  ventas: [ /* página */ ],
  paginacion: { pagina, por_pagina, total, total_paginas }
}
```

`paginacion.total` = count del período (no el tamaño de la página).

### Documentación OpenAPI

`openapi.yaml` (OpenAPI 3) documenta los 4 endpoints, schemas (`Venta`, consolidado, `{ codigo, mensaje }`, resultado de carga) y los status `200` / `201` / `400` / `409`. Se sirve en `GET /docs` (Swagger UI).

Es **documentación**, no codegen: Express no se genera del YAML. Las reglas de negocio (primero gana, carga parcial, Strategy) viven en este spec; el YAML es el contrato HTTP para el reviewer.

## Arquitectura

Tres capas: **controller** (HTTP, multipart, mapear código → 201/409/400) → **service** (validar, partir válidas/inválidas, primero gana, devolver código del catálogo) → **repository** (SQL, `ON CONFLICT`, `SUM`/`GROUP BY`).

Ingesta CSV: **Strategy** `VentaImportParser.parse(archivo) → { ventas, invalidas }` + **factory** (elige por header). Hoy: `CsvColppyV1Parser`. Otro formato = otra clase. El form **no** pasa por parser (ya es una `Venta`); **sí** pasa por el mismo validador del service que las filas del CSV.

Repo: interfaz + SQLite. In-memory para tests de regla. SQL a mano en el adapter, parametrizado.

## UI

- Filtro de período: todo / mayo 2026 / junio 2026 / julio 2026. Al cambiar: `GET /ventas/consolidado` + `GET /ventas` página 1.
- Al paginar: solo `GET /ventas`. El consolidado y los gráficos **no** se vuelven a pedir.
- Arriba: total $ + cantidad; **barras verticales por día**; **donut por medio de pago** (Chart.js + react-chartjs-2, solo `Bar` y `Doughnut`). Sin datos: placeholder, no chart roto.
- Abajo: detalle paginado (el resumen **no** cambia al paginar).
- Carga: form (`id_venta` lo carga el dueño) + upload CSV.
- Alta: toast con `mensaje` del 201 o del 409. Nunca “venta guardada” si no vino `VENTA_CREADA`.
- CSV: `mensaje` de `CARGA_PROCESADA` + detalle de `invalidas`.

Gráficos y números leen `GET /ventas/consolidado`, no `ventas` del detalle.

## Tests (API, supertest)

HTTP in-process contra `createApp` + SQLite temporal. Sin levantar el front.

Happy path:
1. `POST /ventas` válida → `201` + `VENTA_CREADA` y el body trae la venta.
2. CSV de mayo limpio, primera vez → `200` + `CARGA_PROCESADA`, `insertadas` = filas del archivo, `omitidas` = 0.
3. `GET /ventas/consolidado` con datos → `200` con `total`, `cantidad`, `por_medio_pago`, `por_dia` (sin `mensaje`).
4. `GET /ventas` con datos → `200` con `ventas` y `paginacion` (sin `consolidado` ni `mensaje`).

Reglas:
5. Re-subir `ventas_2026-05.csv` no duplica; `omitidas` = las ya existentes.
6. `POST /ventas` con id existente → `409` + `VENTA_EXISTENTE` y la fila no cambia.
7. Fila CSV inválida: en `invalidas`, no persistida; las demás sí.
8. `GET /ventas/consolidado?desde=2026-05-01&hasta=2026-05-31` = suma de mayo. `GET /ventas` de ese período con `por_pagina` chico no cambia ese total.

Borde:
9. CSV ilegible / sin header / formato desconocido / > 1 MB → `400` + `CSV_INVALIDO`.

## Stack

Backend: Express + TypeScript (`strict`). Frontend: React + TypeScript liviano + Vite. DB: SQLite. HTTP: OpenAPI 3. Gráficos: Chart.js.

## Repo

```
backend/     Express + SQLite
frontend/    React + Vite
package.json  orquesta `dev` (ambos)
```

Cada app tiene su `package.json` (`dev` propio). El root levanta los dos a la vez (`concurrently`). No se pone ese script dentro de backend o frontend: una no es dueña de la otra. El reviewer hace `npm install` + `npm run dev` en la raíz.
