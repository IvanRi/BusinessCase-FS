import { validarVenta } from "../domain/validador.js";
import type { EntradaRegistro, Venta } from "../domain/tipos.js";
import type { ResultadoCarga } from "../dto/carga.js";
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
}
