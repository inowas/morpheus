export default function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  let sign = 1;
  if (0 > x) {
    sign = -1;
  }

  // get absX
  const absX = Math.abs(x);

  // A & S 7.1.26 with Horners Method
  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX));
  return sign * y;
}

export function erfc(x: number): number {
  return 1 - erf(x);
}

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
