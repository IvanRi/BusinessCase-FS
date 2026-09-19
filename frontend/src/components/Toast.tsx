import { useEffect } from "react";
import type { TonoToast } from "../tipos";

export type { TonoToast };

interface ToastProps {
  mensaje: string;
  detalle?: string[];
  tono: TonoToast;
  onCerrar: () => void;
}

export function Toast({ mensaje, detalle, tono, onCerrar }: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(onCerrar, 6000);
    return () => window.clearTimeout(id);
    // onCerrar es inline; el timer se reinicia solo si cambia el aviso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensaje, tono, detalle]);

  const rol = tono === "error" ? "alert" : "status";
  const estilo =
    tono === "ok"
      ? "border-green-300 bg-green-50 text-green-800 shadow-green-900/10"
      : "border-red-300 bg-red-50 text-red-800 shadow-red-900/10";

  return (
    <div
      role={rol}
      className={`fixed bottom-24 left-4 right-4 z-40 rounded-2xl border px-4 py-3 text-sm shadow-lg sm:bottom-4 sm:left-auto sm:right-6 sm:max-w-md ${estilo}`}
    >
      <p>{mensaje}</p>
      {detalle && detalle.length > 0 ? (
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs">
          {detalle.map((linea) => (
            <li key={linea}>{linea}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
