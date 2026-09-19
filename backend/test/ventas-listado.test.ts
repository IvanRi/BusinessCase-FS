import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { SqliteVentasRepository } from "../src/repositories/sqliteVentasRepository.js";

const csvMayo = fileURLToPath(new URL("./fixtures/ventas_2026-05.csv", import.meta.url));

function totalMayoFixture(): number {
  const centavos = readFileSync(csvMayo, "utf8")
    .trim()
    .split("\n")
    .slice(1)
    .reduce((acc, linea) => acc + Math.round(Number(linea.split(",")[5]) * 100), 0);
  return centavos / 100;
}

function appDePrueba() {
  return createApp(new SqliteVentasRepository(":memory:"));
}

describe("GET /ventas", () => {
  it("con datos responde 200 con ventas y paginacion sin consolidado ni mensaje", async () => {
    const app = appDePrueba();
    await request(app).post("/ventas/csv").attach("file", csvMayo);

    const res = await request(app).get("/ventas");

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeUndefined();
    expect(res.body.consolidado).toBeUndefined();
    expect(Array.isArray(res.body.ventas)).toBe(true);
    expect(res.body.ventas.length).toBeGreaterThan(0);
    expect(res.body.paginacion).toMatchObject({
      pagina: expect.any(Number),
      por_pagina: expect.any(Number),
      total: expect.any(Number),
      total_paginas: expect.any(Number),
    });
  });

  it("con por_pagina chico no cambia el total del consolidado de mayo", async () => {
    const app = appDePrueba();
    await request(app).post("/ventas/csv").attach("file", csvMayo);
    await request(app).post("/ventas").send({
      id_venta: "V-1999",
      fecha: "2026-06-01",
      cliente: "Cliente",
      producto: "Prod",
      cantidad: 1,
      importe: 999999,
      medio_pago: "efectivo",
    });

    const periodo = { desde: "2026-05-01", hasta: "2026-05-31" };
    const consolidado = await request(app).get("/ventas/consolidado").query(periodo);
    const detalle = await request(app).get("/ventas").query({ ...periodo, por_pagina: 3 });
    const consolidadoDespues = await request(app).get("/ventas/consolidado").query(periodo);

    expect(detalle.status).toBe(200);
    expect(detalle.body.ventas.length).toBe(3);
    expect(detalle.body.paginacion.total).toBe(14);
    expect(consolidado.body.total).toBe(totalMayoFixture());
    expect(consolidadoDespues.body.total).toBe(consolidado.body.total);
  });
});
