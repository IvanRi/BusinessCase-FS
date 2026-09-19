import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { SqliteVentasRepository } from "../src/repositories/sqliteVentasRepository.js";

const csvMayo = fileURLToPath(new URL("./fixtures/ventas_2026-05.csv", import.meta.url));
const FILAS_MAYO = readFileSync(csvMayo, "utf8")
  .trim()
  .split("\n")
  .slice(1).length;

function appDePrueba() {
  const repo = new SqliteVentasRepository(":memory:");
  return { app: createApp(repo), repo };
}

describe("POST /ventas/csv", () => {
  it("csv de mayo limpio primera vez responde 200 y CARGA_PROCESADA", async () => {
    const { app } = appDePrueba();
    const res = await request(app).post("/ventas/csv").attach("file", csvMayo);

    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe("CARGA_PROCESADA");
    expect(res.body.insertadas).toBe(FILAS_MAYO);
    expect(res.body.omitidas).toBe(0);
  });

  it("re-subir el csv de mayo no duplica y omitidas son las ya existentes", async () => {
    const { app } = appDePrueba();
    await request(app).post("/ventas/csv").attach("file", csvMayo);

    const res = await request(app).post("/ventas/csv").attach("file", csvMayo);

    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe("CARGA_PROCESADA");
    expect(res.body.insertadas).toBe(0);
    expect(res.body.omitidas).toBe(FILAS_MAYO);
  });

  it("fila csv invalida va a invalidas y no se persiste; las demas si", async () => {
    const { app, repo } = appDePrueba();
    const csv = [
      "id_venta,fecha,cliente,producto,cantidad,importe,medio_pago",
      "V-9001,2026-05-02,Cliente,Prod,1,100,efectivo",
      "V-9002,2026-05-02,Cliente,Prod,0,100,efectivo",
    ].join("\n");

    const res = await request(app)
      .post("/ventas/csv")
      .attach("file", Buffer.from(csv), "parcial.csv");

    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe("CARGA_PROCESADA");
    expect(res.body.insertadas).toBe(1);
    expect(res.body.invalidas.length).toBe(1);
    expect(res.body.invalidas[0].id_venta).toBe("V-9002");
    expect(repo.findById("V-9001")).toBeDefined();
    expect(repo.findById("V-9002")).toBeUndefined();
  });

  it("csv sin header o formato desconocido o mayor a 1 MB responde 400 y CSV_INVALIDO", async () => {
    const { app } = appDePrueba();

    const sinHeader = await request(app)
      .post("/ventas/csv")
      .attach("file", Buffer.from("foo,bar\n1,2"), "otro.csv");
    expect(sinHeader.status).toBe(400);
    expect(sinHeader.body.codigo).toBe("CSV_INVALIDO");

    const grande = await request(app)
      .post("/ventas/csv")
      .attach("file", Buffer.alloc(1024 * 1024 + 1), "grande.csv");
    expect(grande.status).toBe(400);
    expect(grande.body.codigo).toBe("CSV_INVALIDO");
  });
});
