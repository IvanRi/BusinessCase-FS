import { apiFetch } from "./client";
import type { AltaVenta, CargaCsv, Consolidado, PaginaVentas, Venta } from "../tipos";

export function getConsolidado(
  desde: string,
  hasta: string,
  signal?: AbortSignal,
): Promise<Consolidado> {
  const query = new URLSearchParams({ desde, hasta });
  return apiFetch(`/ventas/consolidado?${query}`, { signal });
}

export function getVentas(
  desde: string,
  hasta: string,
  pagina: number,
  porPagina: number,
  signal?: AbortSignal,
): Promise<PaginaVentas> {
  const query = new URLSearchParams({
    desde,
    hasta,
    pagina: String(pagina),
    por_pagina: String(porPagina),
  });
  return apiFetch(`/ventas?${query}`, { signal });
}

export function crearVenta(venta: Venta, signal?: AbortSignal): Promise<AltaVenta> {
  return apiFetch("/ventas", {
    method: "POST",
    body: JSON.stringify(venta),
    signal,
  });
}

export function cargarCsv(archivo: File, signal?: AbortSignal): Promise<CargaCsv> {
  const body = new FormData();
  body.append("file", archivo);
  return apiFetch("/ventas/csv", { method: "POST", body, signal });
}
