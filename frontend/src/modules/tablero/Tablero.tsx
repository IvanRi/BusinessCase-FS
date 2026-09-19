import { pesos } from "../../helpers/formato";
import { Card } from "../../components/Card";
import { Loader } from "../../components/Loader";
import { useVentas } from "../../context/VentasContext";
import { Graficos } from "./Graficos";

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
    return <Loader className="mt-6" />;
  }

  return (
    <section className="relative mt-6 min-w-0 space-y-4">
      {cargandoConsolidado ? <Loader overlay /> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-white to-brand-soft/70">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-dark">Total</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {pesos.format(consolidado.total)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Cantidad</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {consolidado.cantidad}
          </p>
        </Card>
      </div>
      <Graficos consolidado={consolidado} />
    </section>
  );
}
