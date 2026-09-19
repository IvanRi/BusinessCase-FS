import { useVentas } from "../../context/VentasContext";
import { Graficos } from "./Graficos";

const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export function Tablero() {
  const { consolidado, cargandoConsolidado, errorConsolidado } = useVentas();

  if (errorConsolidado && !consolidado) {
    return (
      <p className="mt-6 text-sm text-red-700" role="alert">
        {errorConsolidado}
      </p>
    );
  }

  if (!consolidado) {
    return <p className="mt-6 text-sm text-zinc-500">Cargando…</p>;
  }

  return (
    <section className={`mt-6 min-w-0 ${cargandoConsolidado ? "opacity-60" : ""}`}>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <article className="rounded-md border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total</p>
          <p className="text-2xl font-semibold tracking-tight">{pesos.format(consolidado.total)}</p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Cantidad</p>
          <p className="text-2xl font-semibold tracking-tight">{consolidado.cantidad}</p>
        </article>
      </div>
      <Graficos consolidado={consolidado} />
    </section>
  );
}
