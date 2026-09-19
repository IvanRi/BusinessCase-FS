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

export interface EntradaRegistro {
  fila: number;
  datos: unknown;
}

