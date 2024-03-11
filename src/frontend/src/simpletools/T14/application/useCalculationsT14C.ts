import {erfc} from './useCalculationsT14';

export const calcDQ = (d: number, S: number, T: number, t: number, lambda: number, Qw: number): number => {
  const erfc1 = erfc(Math.sqrt((d * d * S) / (4 * T * t)));
  const exp1 = Math.exp((lambda * lambda * t / (4 * S * T)) + lambda * d / (2 * T));
  const erfc2 = erfc(Math.sqrt((lambda * lambda * t / (4 * S * T))) + Math.sqrt((d * d * S) / (4 * T * t)));
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
  lambda: number,
  dt: number,
): DiagramDataPoint[] => {
  const data: DiagramDataPoint[] = [];
  for (let t = tMin; t < tMax; t += dt) {
    data.push({
      t: t,
      dQ: calcDQ(d, S, T, t, lambda, Qw),
    });
  }
  return data;
};

