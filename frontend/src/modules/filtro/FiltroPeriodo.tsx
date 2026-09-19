import { Select } from "../../components/Select";
import { useVentas } from "../../context/VentasContext";
import { ANIOS, MESES, type MesPeriodo } from "../../periodos";

export function FiltroPeriodo() {
  const { periodo, setPeriodo, rango } = useVentas();

  return (
    <section className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      <Select
        label="Año"
        value={periodo.anio}
        onChange={(e) => setPeriodo({ ...periodo, anio: Number(e.target.value) })}
      >
        {ANIOS.map((anio) => (
          <option key={anio} value={anio}>
            {anio}
          </option>
        ))}
      </Select>
      <Select
        label="Mes"
        value={String(periodo.mes)}
        onChange={(e) => setPeriodo({ ...periodo, mes: parseMes(e.target.value) })}
      >
        <option value="todo">Todo</option>
        {MESES.map((mes) => (
          <option key={mes.valor} value={mes.valor}>
            {mes.label}
          </option>
        ))}
      </Select>
      <p className="min-w-0 break-all text-sm text-zinc-500 sm:pb-2.5">
        {rango.desde} → {rango.hasta}
      </p>
    </section>
  );
}

function parseMes(valor: string): MesPeriodo {
  if (valor === "todo") {
    return "todo";
  }
  return Number(valor) as MesPeriodo;
}
