import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getConsolidado } from "../api/ventas";
import { PERIODO_DEFAULT, rangoPeriodo, type Periodo } from "../helpers/periodos";
import type { Consolidado } from "../tipos";

interface VentasContextValue {
  periodo: Periodo;
  setPeriodo: (periodo: Periodo) => void;
  rango: { desde: string; hasta: string };
  consolidado: Consolidado | undefined;
  cargandoConsolidado: boolean;
  errorConsolidado: string | undefined;
}

const VentasContext = createContext<VentasContextValue | undefined>(undefined);

export function VentasProvider({ children }: { children: ReactNode }) {
  const [periodo, setPeriodo] = useState<Periodo>(PERIODO_DEFAULT);
  const rango = useMemo(() => rangoPeriodo(periodo.anio, periodo.mes), [periodo]);
  const [consolidado, setConsolidado] = useState<Consolidado | undefined>(undefined);
  const [cargandoConsolidado, setCargandoConsolidado] = useState(false);
  const [errorConsolidado, setErrorConsolidado] = useState<string | undefined>(undefined);

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
        if (ac.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
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

  return (
    <VentasContext.Provider
      value={{
        periodo,
        setPeriodo,
        rango,
        consolidado,
        cargandoConsolidado,
        errorConsolidado,
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
