import type { Venta } from "../domain/tipos.js";

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
