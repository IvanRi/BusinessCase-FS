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
import { Card } from "../../components/Card";
import { Placeholder } from "../../components/Placeholder";
import { COLOR_BRAND, COLORES_MEDIO } from "../../tema";
import type { Consolidado } from "../../tipos";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "system-ui, sans-serif";
ChartJS.defaults.color = "#52525b";

const opcionesComunes = {
  responsive: true,
  maintainAspectRatio: false,
};

export function Graficos({ consolidado }: { consolidado: Consolidado }) {
  const sinDatos = consolidado.cantidad === 0;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="min-w-0">
        <h3 className="mb-3 text-sm font-medium text-zinc-700">Por día</h3>
        {sinDatos || consolidado.por_dia.length === 0 ? (
          <Placeholder>Sin datos en el período</Placeholder>
        ) : (
          <div className="h-56 min-w-0 sm:h-64">
            <Bar
              options={{
                ...opcionesComunes,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, border: { display: false } },
                  y: { beginAtZero: true, border: { display: false }, grid: { color: "#f4f4f5" } },
                },
              }}
              data={{
                labels: consolidado.por_dia.map((fila) => fila.fecha),
                datasets: [
                  {
                    label: "Total",
                    data: consolidado.por_dia.map((fila) => fila.total),
                    backgroundColor: COLOR_BRAND,
                    borderRadius: 8,
                    borderSkipped: false,
                  },
                ],
              }}
            />
          </div>
        )}
      </Card>
      <Card className="min-w-0">
        <h3 className="mb-3 text-sm font-medium text-zinc-700">Por medio de pago</h3>
        {sinDatos || consolidado.por_medio_pago.length === 0 ? (
          <Placeholder>Sin datos en el período</Placeholder>
        ) : (
          <div className="h-56 min-w-0 sm:h-64">
            <Doughnut
              options={{
                ...opcionesComunes,
                cutout: "68%",
                plugins: { legend: { position: "bottom" } },
              }}
              data={{
                labels: consolidado.por_medio_pago.map((fila) => fila.medio_pago),
                datasets: [
                  {
                    data: consolidado.por_medio_pago.map((fila) => fila.total),
                    backgroundColor: consolidado.por_medio_pago.map(
                      (fila) => COLORES_MEDIO[fila.medio_pago],
                    ),
                    borderWidth: 0,
                  },
                ],
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
