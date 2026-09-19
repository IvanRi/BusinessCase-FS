import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Placeholder } from "../../components/Placeholder";
import type { Consolidado } from "../../tipos";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const opcionesComunes = {
  responsive: true,
  maintainAspectRatio: false,
};

const coloresMedio = {
  efectivo: "#65a30d",
  tarjeta: "#2563eb",
  transferencia: "#d97706",
};

export function Graficos({ consolidado }: { consolidado: Consolidado }) {
  const sinDatos = consolidado.cantidad === 0;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="min-w-0">
        <h3 className="mb-2 text-sm font-medium text-zinc-700">Por día</h3>
        {sinDatos || consolidado.por_dia.length === 0 ? (
          <Placeholder>Sin datos en el período</Placeholder>
        ) : (
          <div className="h-56 min-w-0 sm:h-64">
            <Bar
              options={{
                ...opcionesComunes,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
              data={{
                labels: consolidado.por_dia.map((fila) => fila.fecha),
                datasets: [
                  {
                    label: "Total",
                    data: consolidado.por_dia.map((fila) => fila.total),
                    backgroundColor: "#2563eb",
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="mb-2 text-sm font-medium text-zinc-700">Por medio de pago</h3>
        {sinDatos || consolidado.por_medio_pago.length === 0 ? (
          <Placeholder>Sin datos en el período</Placeholder>
        ) : (
          <div className="h-56 min-w-0 sm:h-64">
            <Doughnut
              options={{
                ...opcionesComunes,
                plugins: { legend: { position: "bottom" } },
              }}
              data={{
                labels: consolidado.por_medio_pago.map((fila) => fila.medio_pago),
                datasets: [
                  {
                    data: consolidado.por_medio_pago.map((fila) => fila.total),
                    backgroundColor: consolidado.por_medio_pago.map(
                      (fila) => coloresMedio[fila.medio_pago],
                    ),
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
