import {erfc} from './useCalculationsT14';

export function calcDQ(Qw: number, d: number, S: number, T: number, t: number): number {
  return Qw * erfc(Math.sqrt((d * d * S) / (4 * T * t)));
}

export interface DiagramDataPoint {
  t: number;
  dQ: number;
}

export function calculateDiagramData(
  Qw: number,
  S: number,
  T: number,
  d: number,
  tMin: number,
  tMax: number,
  dt: number,
): DiagramDataPoint[] {
  const data: DiagramDataPoint[] = [];
  for (let t = tMin; t <= tMax; t += dt) {
    data.push({
      t: t,
      dQ: calcDQ(Qw, d, S, T, t),
    });
  }
  return data;
}
