import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getConsolidado, getVentas } from "../api/ventas";
import { PERIODO_DEFAULT, rangoPeriodo, type Periodo } from "../helpers/periodos";
import type { Consolidado, PaginaVentas } from "../tipos";

export const POR_PAGINA = 10;

interface VentasContextValue {
  periodo: Periodo;
  setPeriodo: (periodo: Periodo) => void;
  rango: { desde: string; hasta: string };
  consolidado: Consolidado | undefined;
  cargandoConsolidado: boolean;
  errorConsolidado: string | undefined;
  listado: PaginaVentas | undefined;
  cargandoListado: boolean;
  errorListado: string | undefined;
  irAPagina: (pagina: number) => void;
}

const VentasContext = createContext<VentasContextValue | undefined>(undefined);

function esAbortado(error: unknown, signal: AbortSignal): boolean {
  return signal.aborted || (error instanceof DOMException && error.name === "AbortError");
}

export function VentasProvider({ children }: { children: ReactNode }) {
  const [periodo, setPeriodoState] = useState<Periodo>(PERIODO_DEFAULT);
  const rango = useMemo(() => rangoPeriodo(periodo.anio, periodo.mes), [periodo]);
  const [pagina, setPagina] = useState(1);
  const [consolidado, setConsolidado] = useState<Consolidado | undefined>(undefined);
  const [cargandoConsolidado, setCargandoConsolidado] = useState(false);
  const [errorConsolidado, setErrorConsolidado] = useState<string | undefined>(undefined);
  const [listado, setListado] = useState<PaginaVentas | undefined>(undefined);
  const [cargandoListado, setCargandoListado] = useState(false);
  const [errorListado, setErrorListado] = useState<string | undefined>(undefined);

  function setPeriodo(siguiente: Periodo) {
    setPeriodoState(siguiente);
    setPagina(1);
  }

  function irAPagina(siguiente: number) {
    setPagina(siguiente);
  }

  useEffect(() => {
    const ac = new AbortController();
    setCargandoConsolidado(true);
    setErrorConsolidado(undefined);

    getConsolidado(rango.desde, rango.hasta, ac.signal)
      .then((data) => {
        if (!ac.signal.aborted) {
          setConsolidado(data);
        }
      })
      .catch((error: unknown) => {
        if (esAbortado(error, ac.signal)) {
          return;
        }
        setErrorConsolidado(error instanceof Error ? error.message : "No se pudo cargar el consolidado");
      })
      .finally(() => {
        if (!ac.signal.aborted) {
          setCargandoConsolidado(false);
        }
      });

    return () => ac.abort();
  }, [rango.desde, rango.hasta]);

  useEffect(() => {
    const ac = new AbortController();
    setCargandoListado(true);
    setErrorListado(undefined);

    getVentas(rango.desde, rango.hasta, pagina, POR_PAGINA, ac.signal)
      .then((data) => {
        if (!ac.signal.aborted) {
          setListado(data);
        }
      })
      .catch((error: unknown) => {
        if (esAbortado(error, ac.signal)) {
          return;
        }
        setErrorListado(error instanceof Error ? error.message : "No se pudo cargar el detalle");
      })
      .finally(() => {
        if (!ac.signal.aborted) {
          setCargandoListado(false);
        }
      });

    return () => ac.abort();
  }, [rango.desde, rango.hasta, pagina]);

  return (
    <VentasContext.Provider
      value={{
        periodo,
        setPeriodo,
        rango,
        consolidado,
        cargandoConsolidado,
        errorConsolidado,
        listado,
        cargandoListado,
        errorListado,
        irAPagina,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
}

export function useVentas() {
  const ctx = useContext(VentasContext);
  if (!ctx) {
    throw new Error("useVentas debe usarse dentro de VentasProvider");
  }
  return ctx;
}
