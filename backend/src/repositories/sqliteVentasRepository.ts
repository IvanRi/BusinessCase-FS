import Database from "better-sqlite3";
import { aCentavos, aPesos } from "../domain/dinero.js";
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
}
