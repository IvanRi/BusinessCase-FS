import { validarVenta } from "../domain/validador.js";
import type { ResultadoCarga, Venta } from "../domain/tipos.js";
import type { VentasRepository } from "../repositories/ventasRepository.js";

export class VentasService {
  constructor(private readonly repo: VentasRepository) {}

  registrarVentas(entradas: unknown[]): ResultadoCarga {
    const invalidas: ResultadoCarga["invalidas"] = [];
    const validas: Venta[] = [];
    let omitidas = 0;

    entradas.forEach((entrada, indice) => {
      const resultado = validarVenta(entrada);
      const fila = indice + 1;
      if (!resultado.ok) {
        invalidas.push({
          fila,
          id_venta: resultado.id_venta,
          motivo: resultado.motivo,
        });
        return;
      }

      const yaEnLote = validas.some((venta) => venta.id_venta === resultado.venta.id_venta);
      if (yaEnLote) {
        omitidas += 1;
        return;
      }

      validas.push(resultado.venta);
    });

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
}
