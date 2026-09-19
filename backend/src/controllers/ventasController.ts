import { Router, type NextFunction, type Request, type Response } from "express";
import multer, { MulterError } from "multer";
import {
  cargaProcesada,
  csvInvalido,
  requestInvalido,
  ventaCreada,
  ventaExistente,
  ventaInvalida,
} from "../mensajes.js";
import { parserParaCsv } from "../parsers/importParserFactory.js";
import { FormatoNoSoportadoError } from "../parsers/ventaImportParser.js";
import type { VentasService } from "../services/ventasService.js";

const TAMANO_MAX_CSV = 1024 * 1024;
const uploadCsv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANO_MAX_CSV },
});

function cuerpoIlegible(body: unknown): boolean {
  return body === undefined || body === null || typeof body !== "object" || Array.isArray(body);
}

export function altaVentaHandler(service: VentasService) {
  return (req: Request, res: Response): void => {
    if (cuerpoIlegible(req.body)) {
      res.status(400).json(requestInvalido());
      return;
    }

    const resultado = service.registrarVentas([{ fila: 1, datos: req.body }]);
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

function queryTexto(valor: unknown): string | undefined {
  return typeof valor === "string" && valor.length > 0 ? valor : undefined;
}

function queryEntero(valor: unknown): number | undefined {
  if (typeof valor !== "string" || valor.length === 0) {
    return undefined;
  }
  const n = Number(valor);
  return Number.isInteger(n) ? n : undefined;
}

export function consolidadoHandler(service: VentasService) {
  return (req: Request, res: Response): void => {
    const consolidado = service.obtenerConsolidado(
      queryTexto(req.query.desde),
      queryTexto(req.query.hasta),
    );
    res.status(200).json(consolidado);
  };
}

export function listadoHandler(service: VentasService) {
  return (req: Request, res: Response): void => {
    const pagina = service.obtenerVentas(
      queryTexto(req.query.desde),
      queryTexto(req.query.hasta),
      queryEntero(req.query.pagina),
      queryEntero(req.query.por_pagina),
    );
    res.status(200).json(pagina);
  };
}

export function cargaCsvHandler(service: VentasService) {
  return (req: Request, res: Response): void => {
    const archivo = req.file;
    if (!archivo) {
      res.status(400).json(csvInvalido());
      return;
    }

    const contenido = archivo.buffer.toString("utf8");
    try {
      const parser = parserParaCsv(contenido);
      const parseado = parser.parse(contenido);
      const resultado = service.registrarVentas(parseado.ventas);
      const invalidas = [...parseado.invalidas, ...resultado.invalidas];
      res.status(200).json({
        ...cargaProcesada(resultado.insertadas, resultado.omitidas, invalidas.length),
        insertadas: resultado.insertadas,
        omitidas: resultado.omitidas,
        invalidas,
      });
    } catch (error) {
      if (error instanceof FormatoNoSoportadoError) {
        res.status(400).json(csvInvalido());
        return;
      }
      throw error;
    }
  };
}

function capturaErrorCsv(req: Request, res: Response, next: NextFunction): void {
  uploadCsv.single("file")(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      res.status(400).json(csvInvalido());
      return;
    }
    if (err) {
      next(err);
      return;
    }
    next();
  });
}

export function ventasRouter(service: VentasService): Router {
  const router = Router();
  router.post("/csv", capturaErrorCsv, cargaCsvHandler(service));
  router.post("/", altaVentaHandler(service));
  router.get("/consolidado", consolidadoHandler(service));
  router.get("/", listadoHandler(service));
  return router;
}
