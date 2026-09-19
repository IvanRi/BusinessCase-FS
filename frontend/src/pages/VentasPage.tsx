import { FiltroPeriodo } from "../modules/filtro/FiltroPeriodo";
import { Tablero } from "../modules/tablero/Tablero";

export function VentasPage() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-5xl lg:px-8 lg:py-8">
      <header className="mb-5 min-w-0 sm:mb-7">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">Resumen</h1>
        <p className="text-sm text-zinc-500">Período, totales y medios de pago</p>
      </header>
      <FiltroPeriodo />
      <Tablero />
    </main>
  );
}
