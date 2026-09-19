import type { FilaInvalida } from "../domain/tipos.js";
import type { EntradaRegistro } from "../domain/tipos.js";

export class FormatoNoSoportadoError extends Error {
  constructor() {
    super("formato de importación no soportado");
    this.name = "FormatoNoSoportadoError";
  }
}

export interface ResultadoParseo {
  ventas: EntradaRegistro[];
  invalidas: FilaInvalida[];
}

export interface VentaImportParser {
  parse(contenido: string): ResultadoParseo;
}
