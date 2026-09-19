import { MEDIOS_PAGO, type MedioPago, type Venta } from "./tipos.js";

export type ResultadoValidacion =
  | { ok: true; venta: Venta }
  | { ok: false; id_venta: string | null; motivo: string };

function texto(valor: unknown): string | null {
  if (typeof valor !== "string") {
    return null;
  }
  const recortado = valor.trim();
  return recortado.length > 0 ? recortado : null;
}

const FORMATO_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function esFechaIso(valor: string): boolean {
  if (!FORMATO_FECHA_ISO.test(valor)) {
    return false;
  }
  const [anio, mes, dia] = valor.split("-").map(Number);
  // Rechaza fechas que matchean el formato pero no existen (p. ej. 2026-02-31).
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

export function validarVenta(input: unknown): ResultadoValidacion {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, id_venta: null, motivo: "La venta debe ser un objeto." };
  }

  const raw = input as Record<string, unknown>;
  const id_venta = texto(raw.id_venta);

  if (!id_venta) {
    return { ok: false, id_venta: null, motivo: "id_venta es obligatorio." };
  }

  const fecha = texto(raw.fecha);
  if (!fecha || !esFechaIso(fecha)) {
    return { ok: false, id_venta, motivo: "fecha debe ser YYYY-MM-DD válida." };
  }

  const cliente = texto(raw.cliente);
  if (!cliente) {
    return { ok: false, id_venta, motivo: "cliente es obligatorio." };
  }

  const producto = texto(raw.producto);
  if (!producto) {
    return { ok: false, id_venta, motivo: "producto es obligatorio." };
  }

  if (typeof raw.cantidad !== "number" || !Number.isInteger(raw.cantidad) || raw.cantidad < 1) {
    return { ok: false, id_venta, motivo: "cantidad debe ser un entero mayor o igual a 1." };
  }

  if (typeof raw.importe !== "number" || Number.isNaN(raw.importe) || raw.importe < 0) {
    return { ok: false, id_venta, motivo: "importe debe ser un número mayor o igual a 0." };
  }

  const medio = texto(raw.medio_pago);
  if (!medio || !MEDIOS_PAGO.includes(medio as MedioPago)) {
    return {
      ok: false,
      id_venta,
      motivo: "medio_pago debe ser efectivo, tarjeta o transferencia.",
    };
  }

  return {
    ok: true,
    venta: {
      id_venta,
      fecha,
      cliente,
      producto,
      cantidad: raw.cantidad,
      importe: raw.importe,
      medio_pago: medio as MedioPago,
    },
  };
}
