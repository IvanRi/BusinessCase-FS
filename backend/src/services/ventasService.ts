import { validarVenta } from "../domain/validador.js";
import type { EntradaRegistro, Venta } from "../domain/tipos.js";
import type { ResultadoCarga } from "../dto/carga.js";
import type { Consolidado } from "../dto/consolidado.js";
import type { PaginaVentas } from "../dto/listado.js";
import type { VentasRepository } from "../repositories/ventasRepository.js";

export class VentasService {
  constructor(private readonly repo: VentasRepository) {}

  registrarVentas(entradas: EntradaRegistro[]): ResultadoCarga {
    const invalidas: ResultadoCarga["invalidas"] = [];
    const validas: Venta[] = [];
    let omitidas = 0;

    for (const entrada of entradas) {
      const resultado = validarVenta(entrada.datos);
      if (!resultado.ok) {
        invalidas.push({
          fila: entrada.fila,
          id_venta: resultado.id_venta,
          motivo: resultado.motivo,
        });
        continue;
      }

      const yaEnLote = validas.some((venta) => venta.id_venta === resultado.venta.id_venta);
      if (yaEnLote) {
        omitidas += 1;
        continue;
      }

      validas.push(resultado.venta);
    }

    const ventasInsertadas: Venta[] = [];
    for (const venta of validas) {
      const insertada = this.repo.insertIgnore(venta);
      if (insertada) {
        ventasInsertadas.push(venta);
      } else {
        omitidas += 1;
      }
    }

    return {
      insertadas: ventasInsertadas.length,
      omitidas,
      invalidas,
      ventasInsertadas,
    };
  }

  obtenerConsolidado(desde?: string, hasta?: string): Consolidado {
    return this.repo.getConsolidado(desde, hasta);
  }

  obtenerVentas(
    desde?: string,
    hasta?: string,
    pagina?: number,
    porPagina?: number,
  ): PaginaVentas {
    return this.repo.listar(desde, hasta, paginaEfectiva(pagina), porPaginaEfectiva(porPagina));
  }
}

const POR_PAGINA_DEFAULT = 20;
const POR_PAGINA_MAX = 100;

function paginaEfectiva(pagina?: number): number {
  return pagina !== undefined && Number.isInteger(pagina) && pagina >= 1 ? pagina : 1;
}

function porPaginaEfectiva(porPagina?: number): number {
  if (porPagina === undefined || !Number.isInteger(porPagina) || porPagina < 1) {
    return POR_PAGINA_DEFAULT;
  }
  return Math.min(porPagina, POR_PAGINA_MAX);
}
