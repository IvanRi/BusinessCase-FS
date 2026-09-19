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

export interface Venta {
  id_venta: string;
  fecha: string;
  cliente: string;
  producto: string;
  cantidad: number;
  importe: number;
  medio_pago: MedioPago;
}

export interface Paginacion {
  pagina: number;
  por_pagina: number;
  total: number;
  total_paginas: number;
}

export interface PaginaVentas {
  ventas: Venta[];
  paginacion: Paginacion;
}

export interface AltaVenta {
  codigo: string;
  mensaje: string;
  venta: Venta;
}

export interface FilaInvalida {
  fila: number;
  id_venta: string | null;
  motivo: string;
}

export interface CargaCsv {
  codigo: string;
  mensaje: string;
  insertadas: number;
  omitidas: number;
  invalidas: FilaInvalida[];
}

export type TonoToast = "ok" | "error";

export interface AvisoCarga {
  mensaje: string;
  tono: TonoToast;
  detalle?: string[];
}
