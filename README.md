# Ventas del día a día

Rebanada para el dueño de una PyME: cargar ventas (una o por CSV), consolidar un período y ver el detalle paginado. El front solo habla con la API. Las reglas están en [`SPEC.md`](./SPEC.md).

## Cómo correrlo

Node 20+. En la raíz:

```bash
npm install
npm run dev
```

| | URL |
|---|---|
| UI | http://localhost:5173 |
| API | http://localhost:3001 |
| OpenAPI | http://localhost:3001/docs |

SQLite se crea solo en `backend/data/` (no va al repo). Para ver números, subí `backend/test/fixtures/ventas_2026-05.csv` desde la UI.

Tests de la API: `npm test -w ventas-api`.

## Stack

Express + TypeScript `strict`, React + TypeScript, SQLite.

## Qué prioricé

- Semántica de carga: idempotencia por `id_venta` (primero gana, no se pisa), CSV parcial, un solo caso de uso `registrarVentas` para el form y el lote.
- Producto: tablero (total, cantidad, barras por día, donut por medio) desde `GET /ventas/consolidado`. Al paginar el detalle no se vuelve a pedir el consolidado.
- Contrato: catálogo `codigo` + `mensaje`; el front muestra el `mensaje` de la API, no inventa copy.

## Riesgos de performance

- Si hay que recalcular un montón de ventas cada vez que el dueño abre el tablero, metería un cache en el servidor (Redis) por período, para no sumar todo de nuevo. Lo importante es vaciarlo cuando entra una venta o un CSV: si solo lo dejo vencer a los X minutos, el resumen queda viejo justo después de cargar.
- Si los CSV se ponen enormes, no los cargaría enteros de una. Los iría leyendo de a poco e insertando de a grupos. Un request no puede quedarse esperando un archivo gigante: eso lo pasaría a segundo plano y le mostraría al dueño cómo viene. El `id_venta` sigue evitando que se duplique el lote.
