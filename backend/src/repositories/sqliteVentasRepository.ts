import Database from "better-sqlite3";
import { aCentavos, aPesos } from "../domain/dinero.js";
import type { Consolidado } from "../dto/consolidado.js";
import type { MedioPago, Venta } from "../domain/tipos.js";
import type { VentasRepository } from "./ventasRepository.js";

interface VentaRow {
  id_venta: string;
  fecha: string;
  cliente: string;
  producto: string;
  cantidad: number;
  importe_centavos: number;
  medio_pago: MedioPago;
}

export class SqliteVentasRepository implements VentasRepository {
  private readonly db: Database.Database;

  constructor(filename: string) {
    this.db = new Database(filename);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ventas (
        id_venta TEXT PRIMARY KEY,
        fecha TEXT NOT NULL,
        cliente TEXT NOT NULL,
        producto TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        importe_centavos INTEGER NOT NULL,
        medio_pago TEXT NOT NULL CHECK (medio_pago IN ('efectivo', 'tarjeta', 'transferencia'))
      );
    `);
  }

  insertIgnore(venta: Venta): boolean {
    const result = this.db
      .prepare(
        `INSERT OR IGNORE INTO ventas
          (id_venta, fecha, cliente, producto, cantidad, importe_centavos, medio_pago)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        venta.id_venta,
        venta.fecha,
        venta.cliente,
        venta.producto,
        venta.cantidad,
        aCentavos(venta.importe),
        venta.medio_pago,
      );

    return result.changes > 0;
  }

  findById(idVenta: string): Venta | undefined {
    const row = this.db
      .prepare(
        `SELECT id_venta, fecha, cliente, producto, cantidad, importe_centavos, medio_pago
         FROM ventas WHERE id_venta = ?`,
      )
      .get(idVenta) as VentaRow | undefined;

    if (!row) {
      return undefined;
    }

    return {
      id_venta: row.id_venta,
      fecha: row.fecha,
      cliente: row.cliente,
      producto: row.producto,
      cantidad: row.cantidad,
      importe: aPesos(row.importe_centavos),
      medio_pago: row.medio_pago,
    };
  }

  getConsolidado(desde?: string, hasta?: string): Consolidado {
    const { where, params } = filtroPeriodo(desde, hasta);

    const resumen = this.db
      .prepare(
        `SELECT COALESCE(SUM(importe_centavos), 0) AS total_centavos, COUNT(*) AS cantidad
         FROM ventas ${where}`,
      )
      .get(...params) as { total_centavos: number; cantidad: number };

    const porMedio = this.db
      .prepare(
        `SELECT medio_pago, SUM(importe_centavos) AS total_centavos, COUNT(*) AS cantidad
         FROM ventas ${where}
         GROUP BY medio_pago
         ORDER BY medio_pago`,
      )
      .all(...params) as Array<{ medio_pago: MedioPago; total_centavos: number; cantidad: number }>;

    const porDia = this.db
      .prepare(
        `SELECT fecha, SUM(importe_centavos) AS total_centavos, COUNT(*) AS cantidad
         FROM ventas ${where}
         GROUP BY fecha
         ORDER BY fecha`,
      )
      .all(...params) as Array<{ fecha: string; total_centavos: number; cantidad: number }>;

    return {
      total: aPesos(resumen.total_centavos),
      cantidad: resumen.cantidad,
      por_medio_pago: porMedio.map((fila) => ({
        medio_pago: fila.medio_pago,
        total: aPesos(fila.total_centavos),
        cantidad: fila.cantidad,
      })),
      por_dia: porDia.map((fila) => ({
        fecha: fila.fecha,
        total: aPesos(fila.total_centavos),
        cantidad: fila.cantidad,
      })),
    };
  }
}

function filtroPeriodo(desde?: string, hasta?: string): { where: string; params: string[] } {
  const condiciones: string[] = [];
  const params: string[] = [];
  if (desde) {
    condiciones.push("fecha >= ?");
    params.push(desde);
  }
  if (hasta) {
    condiciones.push("fecha <= ?");
    params.push(hasta);
  }
  return {
    where: condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "",
    params,
  };
}
