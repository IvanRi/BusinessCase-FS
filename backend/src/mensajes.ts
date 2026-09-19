export const Codigo = {
  VENTA_CREADA: "VENTA_CREADA",
  VENTA_EXISTENTE: "VENTA_EXISTENTE",
  VENTA_INVALIDA: "VENTA_INVALIDA",
  REQUEST_INVALIDO: "REQUEST_INVALIDO",
  CARGA_PROCESADA: "CARGA_PROCESADA",
  CSV_INVALIDO: "CSV_INVALIDO",
} as const;

export type CodigoMensaje = (typeof Codigo)[keyof typeof Codigo];

export function ventaCreada(id: string): { codigo: typeof Codigo.VENTA_CREADA; mensaje: string } {
  return {
    codigo: Codigo.VENTA_CREADA,
    mensaje: `Venta ${id} guardada.`,
  };
}

export function ventaExistente(id: string): {
  codigo: typeof Codigo.VENTA_EXISTENTE;
  mensaje: string;
} {
  return {
    codigo: Codigo.VENTA_EXISTENTE,
    mensaje: `Ya existe una venta con el id ${id}. No se guardó de nuevo.`,
  };
}

export function ventaInvalida(motivo: string): {
  codigo: typeof Codigo.VENTA_INVALIDA;
  mensaje: string;
} {
  return { codigo: Codigo.VENTA_INVALIDA, mensaje: motivo };
}

export function requestInvalido(): {
  codigo: typeof Codigo.REQUEST_INVALIDO;
  mensaje: string;
} {
  return {
    codigo: Codigo.REQUEST_INVALIDO,
    mensaje: "El cuerpo no se pudo leer.",
  };
}

export function cargaProcesada(
  insertadas: number,
  omitidas: number,
  invalidas: number,
): { codigo: typeof Codigo.CARGA_PROCESADA; mensaje: string } {
  return {
    codigo: Codigo.CARGA_PROCESADA,
    mensaje: `${insertadas} insertadas, ${omitidas} omitidas, ${invalidas} inválidas.`,
  };
}

export function csvInvalido(): { codigo: typeof Codigo.CSV_INVALIDO; mensaje: string } {
  return {
    codigo: Codigo.CSV_INVALIDO,
    mensaje: "Archivo ilegible, sin header, formato no soportado o mayor a 1 MB.",
  };
}

