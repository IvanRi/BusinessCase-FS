import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { SqliteVentasRepository } from "../src/repositories/sqliteVentasRepository.js";

function appDePrueba() {
  const repo = new SqliteVentasRepository(":memory:");
  return { app: createApp(repo), repo };
}

const venta = {
  id_venta: "V-1001",
  fecha: "2026-05-02",
  cliente: "Comercial Andrade",
  producto: "Servicio de consultoria",
  cantidad: 1,
  importe: 18500,
  medio_pago: "transferencia",
};

describe("POST /ventas", () => {
  it("alta valida responde 201 y VENTA_CREADA", async () => {
    const { app } = appDePrueba();
    const res = await request(app).post("/ventas").send(venta);

    expect(res.status).toBe(201);
    expect(res.body.codigo).toBe("VENTA_CREADA");
    expect(res.body.mensaje).toContain("V-1001");
    expect(res.body.venta).toMatchObject(venta);
  });

  it("id existente responde 409 y VENTA_EXISTENTE y no pisa la fila", async () => {
    const { app, repo } = appDePrueba();
    await request(app).post("/ventas").send(venta);

    const res = await request(app)
      .post("/ventas")
      .send({ ...venta, importe: 1 });

    expect(res.status).toBe(409);
    expect(res.body.codigo).toBe("VENTA_EXISTENTE");
    expect(res.body.mensaje).toContain("V-1001");
    expect(repo.findById("V-1001")?.importe).toBe(18500);
  });
});
