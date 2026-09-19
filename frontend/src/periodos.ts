export type MesPeriodo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "todo";

export interface Periodo {
  anio: number;
  mes: MesPeriodo;
}

export const PERIODO_DEFAULT: Periodo = { anio: 2026, mes: 5 };

export const ANIOS = [2024, 2025, 2026, 2027, 2028];

export const MESES: { valor: Exclude<MesPeriodo, "todo">; label: string }[] = [
  { valor: 1, label: "Enero" },
  { valor: 2, label: "Febrero" },
  { valor: 3, label: "Marzo" },
  { valor: 4, label: "Abril" },
  { valor: 5, label: "Mayo" },
  { valor: 6, label: "Junio" },
  { valor: 7, label: "Julio" },
  { valor: 8, label: "Agosto" },
  { valor: 9, label: "Septiembre" },
  { valor: 10, label: "Octubre" },
  { valor: 11, label: "Noviembre" },
  { valor: 12, label: "Diciembre" },
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function rangoPeriodo(anio: number, mes: MesPeriodo): { desde: string; hasta: string } {
  if (mes === "todo") {
    return { desde: `${anio}-01-01`, hasta: `${anio}-12-31` };
  }
  const ultimo = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  return { desde: `${anio}-${pad2(mes)}-01`, hasta: `${anio}-${pad2(mes)}-${pad2(ultimo)}` };
}
