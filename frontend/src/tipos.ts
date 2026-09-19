export type MedioPago = "efectivo" | "tarjeta" | "transferencia";

export interface TotalPorMedioPago {
  medio_pago: MedioPago;
  total: number;
  cantidad: number;
}

export interface TotalPorDia {
  fecha: string;
  total: number;
  cantidad: number;
}

export interface Consolidado {
  total: number;
  cantidad: number;
  por_medio_pago: TotalPorMedioPago[];
  por_dia: TotalPorDia[];
}

export interface ErrorApi {
  codigo: string;
  mensaje: string;
}
