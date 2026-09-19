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

describe("GET /ventas/consolidado", () => {
  it("con datos responde 200 con total, cantidad, por_medio_pago y por_dia sin mensaje", async () => {
    const app = appDePrueba();
    await request(app).post("/ventas/csv").attach("file", csvMayo);

    const res = await request(app).get("/ventas/consolidado");

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeUndefined();
    expect(res.body.total).toBe(totalMayoFixture());
    expect(res.body.cantidad).toBe(14);
    expect(Array.isArray(res.body.por_medio_pago)).toBe(true);
    expect(Array.isArray(res.body.por_dia)).toBe(true);
    expect(res.body.por_medio_pago.length).toBeGreaterThan(0);
    expect(res.body.por_dia.length).toBeGreaterThan(0);
  });

  it("el consolidado de mayo es la suma de las ventas de mayo", async () => {
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

    const res = await request(app).get("/ventas/consolidado").query({
      desde: "2026-05-01",
      hasta: "2026-05-31",
    });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(totalMayoFixture());
    expect(res.body.cantidad).toBe(14);
  });
});
