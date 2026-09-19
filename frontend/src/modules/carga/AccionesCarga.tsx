import { useCallback, useState } from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Toast } from "../../components/Toast";
import { useVentas } from "../../context/VentasContext";
import type { AvisoCarga } from "../../tipos";
import { CargaCsv } from "./CargaCsv";
import { FormularioVenta } from "./FormularioVenta";

type ModalCarga = "alta" | "csv" | undefined;

export function AccionesCarga() {
  const { recargar } = useVentas();
  const [modal, setModal] = useState<ModalCarga>(undefined);
  const [aviso, setAviso] = useState<AvisoCarga | undefined>(undefined);

  const cerrar = useCallback(() => {
    setModal(undefined);
  }, []);

  function onListo(siguiente: AvisoCarga, debeRecargar: boolean) {
    setAviso(siguiente);
    if (debeRecargar) {
      recargar();
      cerrar();
    }
  }

  return (
    <>
      <div className="hidden shrink-0 gap-2 sm:flex">
        <Button onClick={() => setModal("csv")}>Cargar CSV</Button>
        <Button variant="primary" onClick={() => setModal("alta")}>
          Agregar venta
        </Button>
      </div>
      {modal ? null : (
        <button
          type="button"
          onClick={() => setModal("alta")}
          aria-label="Cargar ventas"
          className="fixed bottom-5 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-brand text-3xl font-light leading-none text-white shadow-lg shadow-brand/40 sm:hidden"
        >
          +
        </button>
      )}

      <Modal abierto={modal === "alta"} titulo="Cargar ventas" onCerrar={cerrar}>
        <div className="mb-5 space-y-3 rounded-2xl border border-brand/20 bg-brand-soft/50 p-3 sm:hidden">
          <p className="text-sm font-medium text-zinc-900">Cargar CSV</p>
          <CargaCsv onListo={onListo} />
        </div>
        <div className="mb-4 sm:hidden">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-zinc-400">o una venta</p>
        </div>
        <p className="mb-4 hidden text-sm text-zinc-500 sm:block">Alta individual. El id lo carga el dueño.</p>
        <FormularioVenta onListo={onListo} onCancelar={cerrar} />
      </Modal>

      <Modal abierto={modal === "csv"} titulo="Cargar CSV" onCerrar={cerrar}>
        <CargaCsv onListo={onListo} onCancelar={cerrar} />
      </Modal>

      {aviso ? (
        <Toast
          mensaje={aviso.mensaje}
          detalle={aviso.detalle}
          tono={aviso.tono}
          onCerrar={() => setAviso(undefined)}
        />
      ) : null}
    </>
  );
}
