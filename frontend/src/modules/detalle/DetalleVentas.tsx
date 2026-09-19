import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Placeholder } from "../../components/Placeholder";
import { useVentas } from "../../context/VentasContext";
import { pesos } from "../../helpers/formato";
import { COLORES_MEDIO } from "../../tema";
import type { Venta } from "../../tipos";

export function DetalleVentas() {
  const { listado, cargandoListado, errorListado, irAPagina } = useVentas();

  if (errorListado && !listado) {
    return (
      <p className="mt-6 text-sm text-red-700" role="alert">
        {errorListado}
      </p>
    );
  }

  if (!listado) {
    return <p className="mt-6 text-sm text-zinc-500">Cargando detalle…</p>;
  }

  const { ventas, paginacion } = listado;
  const sinFilas = ventas.length === 0;

  return (
    <section className={`mt-6 min-w-0 ${cargandoListado ? "opacity-60" : ""}`}>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Detalle</h2>
        <p className="text-sm text-zinc-500">{paginacion.total} ventas en el período</p>
      </div>
      <Card className="overflow-hidden p-0 sm:p-0">
        {sinFilas ? (
          <div className="p-4 sm:p-5">
            <Placeholder>Sin ventas en el período</Placeholder>
          </div>
        ) : (
          <>
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b border-zinc-100 bg-brand-soft/40 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Id</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3 text-right">Cant.</th>
                    <th className="px-4 py-3 text-right">Importe</th>
                    <th className="px-4 py-3">Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.id_venta} className="border-b border-zinc-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-zinc-900">{venta.id_venta}</td>
                      <td className="px-4 py-3 text-zinc-600">{venta.fecha}</td>
                      <td className="px-4 py-3 text-zinc-700">{venta.cliente}</td>
                      <td className="px-4 py-3 text-zinc-700">{venta.producto}</td>
                      <td className="px-4 py-3 text-right text-zinc-700">{venta.cantidad}</td>
                      <td className="px-4 py-3 text-right font-medium">{pesos.format(venta.importe)}</td>
                      <td className="px-4 py-3">
                        <MedioPagoBadge medio={venta.medio_pago} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-zinc-100 md:hidden">
              {ventas.map((venta) => (
                <li key={venta.id_venta} className="px-4 py-3">
                  <FilaMobile venta={venta} />
                </li>
              ))}
            </ul>
          </>
        )}
        {paginacion.total_paginas > 1 ? (
          <div className="flex flex-col gap-3 border-t border-zinc-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Página {paginacion.pagina} de {paginacion.total_paginas}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={paginacion.pagina <= 1}
                onClick={() => irAPagina(paginacion.pagina - 1)}
              >
                Anterior
              </Button>
              <Button
                disabled={paginacion.pagina >= paginacion.total_paginas}
                onClick={() => irAPagina(paginacion.pagina + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </section>
  );
}

function FilaMobile({ venta }: { venta: Venta }) {
  return (
    <article className="min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-zinc-900">{venta.id_venta}</p>
        <MedioPagoBadge medio={venta.medio_pago} />
      </div>
      <p className="mt-1 truncate text-sm text-zinc-700">{venta.cliente}</p>
      <p className="truncate text-sm text-zinc-500">{venta.producto}</p>
      <p className="mt-1 text-sm text-zinc-600">
        {venta.fecha} · {venta.cantidad} · {pesos.format(venta.importe)}
      </p>
    </article>
  );
}

function MedioPagoBadge({ medio }: { medio: Venta["medio_pago"] }) {
  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: COLORES_MEDIO[medio] }}
    >
      {medio}
    </span>
  );
}
