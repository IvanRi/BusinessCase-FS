import { apiFetch } from "./client";
import type { Consolidado } from "../tipos";

export function getConsolidado(
  desde: string,
  hasta: string,
  signal?: AbortSignal,
): Promise<Consolidado> {
  const query = new URLSearchParams({ desde, hasta });
  return apiFetch(`/ventas/consolidado?${query}`, { signal });
}
