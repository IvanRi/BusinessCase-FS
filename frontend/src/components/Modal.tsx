import { useEffect, type ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  useEffect(() => {
    if (!abierto) {
      return;
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCerrar();
      }
    }

    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40"
        aria-label="Cerrar"
        onClick={onCerrar}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl shadow-brand/20 sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-5">
          <h2 id="modal-titulo" className="text-lg font-semibold tracking-tight text-zinc-900">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-zinc-500 transition hover:bg-brand-soft hover:text-brand-dark"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
