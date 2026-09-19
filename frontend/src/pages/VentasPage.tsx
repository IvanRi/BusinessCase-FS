import { FiltroPeriodo } from "../modules/filtro/FiltroPeriodo";
import { Tablero } from "../modules/tablero/Tablero";

export function VentasPage() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-5xl lg:px-8 lg:py-8">
      <h1 className="mb-4 text-xl font-semibold text-zinc-900 sm:mb-6 sm:text-2xl">Ventas</h1>
      <FiltroPeriodo />
      <Tablero />
    </main>
  );
}
