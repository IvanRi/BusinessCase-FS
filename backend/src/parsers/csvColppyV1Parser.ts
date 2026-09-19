import type { ResultadoParseo, VentaImportParser } from "./ventaImportParser.js";

export const HEADER_COLPPY_V1 = [
  "id_venta",
  "fecha",
  "cliente",
  "producto",
  "cantidad",
  "importe",
  "medio_pago",
] as const;

export function esHeaderColppyV1(linea: string): boolean {
  const columnas = columnasDe(linea);
  if (columnas.length < HEADER_COLPPY_V1.length) {
    return false;
  }
  return HEADER_COLPPY_V1.every((nombre, i) => columnas[i] === nombre);
}

function columnasDe(linea: string): string[] {
  return linea.replace(/^\uFEFF/, "").split(",").map((col) => col.trim());
}

export class CsvColppyV1Parser implements VentaImportParser {
  parse(contenido: string): ResultadoParseo {
    const lineas = contenido.split(/\r?\n/);
    const ventas: ResultadoParseo["ventas"] = [];
    const invalidas: ResultadoParseo["invalidas"] = [];

    for (let i = 1; i < lineas.length; i += 1) {
      const linea = lineas[i];
      if (linea === undefined || linea.trim() === "") {
        continue;
      }

      const fila = i + 1;
      const columnas = columnasDe(linea);
      if (columnas.length < HEADER_COLPPY_V1.length) {
        invalidas.push({
          fila,
          id_venta: columnas[0] || null,
          motivo: "faltan columnas",
        });
        continue;
      }

      const cantidad = Number(columnas[4]);
      const importe = Number(columnas[5]);

      ventas.push({
        fila,
        datos: {
          id_venta: columnas[0],
          fecha: columnas[1],
          cliente: columnas[2],
          producto: columnas[3],
          cantidad,
          importe,
          medio_pago: columnas[6],
        },
      });
    }

    return { ventas, invalidas };
  }
}
