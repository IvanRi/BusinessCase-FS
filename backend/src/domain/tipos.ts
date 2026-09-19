export type MedioPago = "efectivo" | "tarjeta" | "transferencia";

export const MEDIOS_PAGO: readonly MedioPago[] = [
  "efectivo",
  "tarjeta",
  "transferencia",
];

export interface Venta {
  id_venta: string;
  fecha: string;
  cliente: string;
  producto: string;
  cantidad: number;
  importe: number;
  medio_pago: MedioPago;
}

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
