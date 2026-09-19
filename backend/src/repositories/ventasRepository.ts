import type { Consolidado } from "../dto/consolidado.js";
import type { PaginaVentas } from "../dto/listado.js";
import type { Venta } from "../domain/tipos.js";

export interface VentasRepository {
  insertIgnore(venta: Venta): boolean;
  findById(idVenta: string): Venta | undefined;
  getConsolidado(desde?: string, hasta?: string): Consolidado;
  listar(desde: string | undefined, hasta: string | undefined, pagina: number, porPagina: number): PaginaVentas;
}
