import type { Venta } from "../domain/tipos.js";

export interface FilaInvalida {
  fila: number;
  id_venta: string | null;
  motivo: string;
}

export interface ResultadoCarga {
  insertadas: number;
  omitidas: number;
  invalidas: FilaInvalida[];
  ventasInsertadas: Venta[];
}
