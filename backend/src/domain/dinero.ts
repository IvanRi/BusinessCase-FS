export function aCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

export function aPesos(centavos: number): number {
  return centavos / 100;
}
