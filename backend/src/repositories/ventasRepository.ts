import type { Venta } from "../domain/tipos.js";

export interface VentasRepository {
  insertIgnore(venta: Venta): boolean;
  findById(idVenta: string): Venta | undefined;
}
