import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PERIODO_DEFAULT, rangoPeriodo, type Periodo } from "../periodos";

interface VentasContextValue {
  periodo: Periodo;
  setPeriodo: (periodo: Periodo) => void;
  rango: { desde: string; hasta: string };
}

const VentasContext = createContext<VentasContextValue | undefined>(undefined);

export function VentasProvider({ children }: { children: ReactNode }) {
  const [periodo, setPeriodo] = useState<Periodo>(PERIODO_DEFAULT);
  const rango = useMemo(() => rangoPeriodo(periodo.anio, periodo.mes), [periodo]);

  return (
    <VentasContext.Provider value={{ periodo, setPeriodo, rango }}>
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
