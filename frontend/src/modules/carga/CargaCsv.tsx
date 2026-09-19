import { useState, type FormEvent } from "react";
import { cargarCsv } from "../../api/ventas";
import { ApiError } from "../../api/client";
import { Button } from "../../components/Button";
import { Loader } from "../../components/Loader";
import type { AvisoCarga } from "../../tipos";

interface CargaCsvProps {
  onListo: (aviso: AvisoCarga, recargar: boolean) => void;
  onCancelar?: () => void;
}

export function CargaCsv({ onListo, onCancelar }: CargaCsvProps) {
  const [archivo, setArchivo] = useState<File | undefined>(undefined);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!archivo) {
      return;
    }

    setEnviando(true);
    try {
      const carga = await cargarCsv(archivo);
      const detalle = carga.invalidas.map((fila) => {
        const id = fila.id_venta ? ` · ${fila.id_venta}` : "";
        return `Fila ${fila.fila}${id}: ${fila.motivo}`;
      });
      onListo(
        {
          mensaje: carga.mensaje,
          tono: carga.codigo === "CARGA_PROCESADA" ? "ok" : "error",
          detalle: detalle.length > 0 ? detalle : undefined,
        },
        carga.codigo === "CARGA_PROCESADA",
      );
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        onListo({ mensaje: error.message, tono: "error" }, false);
      } else {
        onListo(
          { mensaje: error instanceof Error ? error.message : "No se pudo enviar el CSV", tono: "error" },
          false,
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="relative min-h-28">
      {enviando ? <Loader overlay label="Cargando CSV…" /> : null}
      <form className={`space-y-3 ${enviando ? "pointer-events-none" : ""}`} onSubmit={onSubmit}>
        <label className="flex min-w-0 w-full flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-600">Archivo CSV</span>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            disabled={enviando}
            onChange={(e) => setArchivo(e.target.files?.[0])}
            className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-dark"
          />
        </label>
        <p className="text-xs text-zinc-500">
          Header: id_venta,fecha,cliente,producto,cantidad,importe,medio_pago. Máx. 1 MB.
        </p>
        <div className="flex justify-end gap-2">
          {onCancelar ? (
            <Button type="button" onClick={onCancelar} disabled={enviando}>
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" variant="primary" disabled={enviando || !archivo}>
            {enviando ? "Cargando…" : "Cargar CSV"}
          </Button>
        </div>
      </form>
    </div>
  );
}
