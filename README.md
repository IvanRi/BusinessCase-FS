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

Tests de la API: `npm test -w ventas-api`.

## Stack

Express + TypeScript `strict`, React + TypeScript, SQLite. Express me parece mas que suficiente para lo que se pide y es el framework mas sencillo de entender de entrada asi que descarte otros como Nest. Sqlite me ayuda en este caso para que el reviewer pueda levantar y probar rapidamente lo usaria solo para este caso. React + vite en lo personal creo que hoy es la opcion mas usada en el mercado.
Desarrolle basandone en el desarrollo del spec primero bajando la logica de negocio y luego integrando primero los test de la api para usarlos como guia con la IA.

## Que deje de lado

Redis, Nest por ejemplo por que para el caso son sobre ingenieria y tambien ORM como prisma me parecio en lo personal mas conveniente hacer querys sobre la base para tener mas control y mejorar la legibilidad a la hora del review se puede ver que hace exactamente. Con las librerias ubiera sido mas rapido sin dudas pero menos codigo no es mas performance ni suma legibilidad a mi entender.

## Que priorice

- Idempotencia por `id_venta` (primero gana, no se pisa), CSV parcial, un solo caso de uso `registrarVentas` para el form y el lote.
- Producto: tablero (total, cantidad, barras por dia, donut por medio) desde `GET /ventas/consolidado`. Al paginar el detalle no se vuelve a pedir el consolidado.
- Performance para el paginado un front sin paginado con miles de registros es igual a un renderizado lento y separe las llamadas del consolidado para evitar recalcular ya que no meti un redis o una cache en memoria.

## Riesgos de performance

- Si hay que recalcular muchas ventas cada vez que el dueño abre el tablero, meteria un cache en el servidor (Redis) por periodo y id de usuario, para no sumar todo de nuevo. Lo importante es vaciarlo cuando entra una venta o un CSV: si solo lo dejo vencer a los X minutos, el resumen queda viejo justo despues de cargar.

- Si los CSV se ponen enormes, no los cargaria enteros de una. Los iria leyendo de a poco e insertando de a grupos. Un request no puede quedarse esperando un archivo gigante asi que eso lo pasaria a segundo plano en un job async y le mostraria al dueño como viene. El `id_venta` sigue evitando que se duplique el lote. Para medirlo tendria que trackear el tiempo que tardan en cargar los archivos y encontrar un tamano aceptable para hacerlo sincrono y cuando pasarlo a un proceso asincrono.
