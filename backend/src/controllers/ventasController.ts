import { Router, type Request, type Response } from "express";
import { requestInvalido, ventaCreada, ventaExistente, ventaInvalida } from "../mensajes.js";
import type { VentasService } from "../services/ventasService.js";

function cuerpoIlegible(body: unknown): boolean {
  return body === undefined || body === null || typeof body !== "object" || Array.isArray(body);
}

export function altaVentaHandler(service: VentasService) {
  return (req: Request, res: Response): void => {
    if (cuerpoIlegible(req.body)) {
      res.status(400).json(requestInvalido());
      return;
    }

    const resultado = service.registrarVentas([req.body]);
    const primera = resultado.invalidas[0];
    if (primera) {
      res.status(400).json(ventaInvalida(primera.motivo));
      return;
    }

    const id = typeof req.body.id_venta === "string" ? req.body.id_venta.trim() : "";
    if (resultado.omitidas > 0) {
      res.status(409).json(ventaExistente(id));
      return;
    }

    const venta = resultado.ventasInsertadas[0];
    if (!venta) {
      res.status(400).json(requestInvalido());
      return;
    }

    res.status(201).json({ ...ventaCreada(venta.id_venta), venta });
  };
}

export function ventasRouter(service: VentasService): Router {
  const router = Router();
  router.post("/", altaVentaHandler(service));
  return router;
}
