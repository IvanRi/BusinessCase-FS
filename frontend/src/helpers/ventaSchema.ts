import * as yup from "yup";
import type { MedioPago } from "../tipos";

const MEDIOS: MedioPago[] = ["efectivo", "tarjeta", "transferencia"];
const FORMATO_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function esFechaIso(valor: string): boolean {
  if (!FORMATO_FECHA_ISO.test(valor)) {
    return false;
  }
  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

export const esquemaVenta = yup.object({
  id_venta: yup.string().trim().required("id_venta es obligatorio."),
  fecha: yup
    .string()
    .trim()
    .required("fecha debe ser YYYY-MM-DD válida.")
    .test("fecha-iso", "fecha debe ser YYYY-MM-DD válida.", (valor) => !!valor && esFechaIso(valor)),
  cliente: yup.string().trim().required("cliente es obligatorio."),
  producto: yup.string().trim().required("producto es obligatorio."),
  cantidad: yup
    .number()
    .typeError("cantidad debe ser un entero mayor o igual a 1.")
    .integer("cantidad debe ser un entero mayor o igual a 1.")
    .min(1, "cantidad debe ser un entero mayor o igual a 1.")
    .required("cantidad debe ser un entero mayor o igual a 1."),
  importe: yup
    .number()
    .typeError("importe debe ser un número mayor o igual a 0.")
    .min(0, "importe debe ser un número mayor o igual a 0.")
    .required("importe debe ser un número mayor o igual a 0."),
  medio_pago: yup
    .mixed<MedioPago>()
    .oneOf(MEDIOS, "medio_pago debe ser efectivo, tarjeta o transferencia.")
    .required("medio_pago debe ser efectivo, tarjeta o transferencia."),
});

export type FormularioVenta = yup.InferType<typeof esquemaVenta>;
