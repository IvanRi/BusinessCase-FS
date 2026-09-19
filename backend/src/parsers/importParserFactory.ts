import { CsvColppyV1Parser, esHeaderColppyV1 } from "./csvColppyV1Parser.js";
import { FormatoNoSoportadoError, type VentaImportParser } from "./ventaImportParser.js";

export function parserParaCsv(contenido: string): VentaImportParser {
  const primeraLinea = contenido.split(/\r?\n/)[0];
  if (!primeraLinea || !esHeaderColppyV1(primeraLinea)) {
    throw new FormatoNoSoportadoError();
  }
  return new CsvColppyV1Parser();
}
