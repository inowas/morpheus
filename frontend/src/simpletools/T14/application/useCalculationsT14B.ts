import {erfc} from './useCalculationsT14';

export const calcDQ = (d: number, S: number, T: number, t: number, L: number, Qw: number): number => {
  const erfc1 = erfc(Math.sqrt((d * d * S) / (4 * T * t)));
  const exp1 = Math.exp((T * t / (S * L * L)) + d / L);
  const erfc2 = erfc(Math.sqrt(T * t / (S * L * L)) + Math.sqrt((d * d * S) / (4 * T * t)));
  return Qw * (erfc1 - exp1 * erfc2);
};

export interface DiagramDataPoint {
  t: number;
  dQ: number;
}

export const calculateDiagramData = (
  Qw: number,
  S: number,
  T: number,
  d: number,
  tMin: number,
  tMax: number,
  L: number,
  dt: number,
): DiagramDataPoint[] => {
  const data: DiagramDataPoint[] = [];
  for (let t = tMin; t < tMax; t += dt) {
    data.push({
      t: t,
      dQ: calcDQ(d, S, T, t, L, Qw),
    });
  }
  return data;
};

