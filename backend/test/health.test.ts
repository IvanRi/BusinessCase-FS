import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { SqliteVentasRepository } from "../src/repositories/sqliteVentasRepository.js";

describe("andamiaje", () => {
  it("GET /health responde 200", async () => {
    const app = createApp(new SqliteVentasRepository(":memory:"));
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
