import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { ventasRouter } from "./controllers/ventasController.js";
import { requestInvalido } from "./mensajes.js";
import { cargarOpenApi } from "../openapi/cargarOpenApi.js";
import type { VentasRepository } from "./repositories/ventasRepository.js";
import { VentasService } from "./services/ventasService.js";

function openApiSpec(): object {
  return cargarOpenApi(fileURLToPath(new URL("../openapi.yaml", import.meta.url)));
}

export function createApp(repo: VentasRepository): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
      res.status(400).json(requestInvalido());
      return;
    }
    next(err);
  });

  const service = new VentasService(repo);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/ventas", ventasRouter(service));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec()));

  return app;
}
