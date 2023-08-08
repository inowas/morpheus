export function calculateQCrit(q: number, mu: number, xw: number): number {
  return q * mu * xw;
}

export function calculateDiagramData(q: number, mu: number, xw: number) {
  const data: { xw: number; Qcrit: number }[] = [];
  for (let x = 0; x < xw; x = x + 100) {
    const dataSet = {xw: Number(x), Qcrit: calculateQCrit(q, mu, x)};
    data.push(dataSet);
  }

  const dataSet = {xw: Number(xw), Qcrit: calculateQCrit(q, mu, xw)};
  data.push(dataSet);
  return data;
}

export function dRo(rhof: number, rhos: number): number {
  return rhof / (rhos - rhof);
}

export function calcXt(k: number, b: number, q: number, Qw: number, xw: number, rhof: number, rhos: number, AqType?: string): number {
  const dRho = dRo(rhof, rhos);
  const lhs = 0.5 * (1 + dRho) * b * b / (dRho * dRho);
  let xt = lhs * k / q;
  let rhs = 0;

  do {
    const term1 = q * xt / k;
    const term2 = Qw * Math.log(Math.pow((xt - xw), 2) / Math.pow((xt + xw), 2)) / (4 * Math.PI * k);
    rhs = term1 + term2;
    xt = xt + (lhs - rhs);
  } while (0.000001 < Math.abs(lhs - rhs));
  return xt;
}

export function calcLambda(k: number, b: number, q: number, xw: number, rhof: number, rhos: number, AqType: string): number {
  console.log(k, b, q, xw, rhof, rhos, AqType);
  const dRho = dRo(rhof, rhos);
  if ('unconfined' === AqType) {
    return (k * b * b / (q * xw)) * ((1 + dRho) / (dRho * dRho));
  }
  // confined
  return (k * b * b / (q * xw * dRho));
}

export function calcMu(Lambda: number): number {
  let iter = 1;
  let mu = 0.0000001;
  let rhs = 0;
  do {
    const term1 = 2 * Math.sqrt((1 - mu / Math.PI));
    const term2 = (mu / Math.PI) * Math.log((1 - Math.sqrt((1 - mu / Math.PI))) / (1 + Math.sqrt((1 - mu / Math.PI))));
    rhs = term1 + term2;
    mu = mu + Math.abs(Lambda - rhs) / Math.PI;
    if (0 > mu) {
      mu = 0.0000001;
    } // this should not happen
    iter = iter + 1;
  } while (100 > iter); // Lambda-rhs>0.000001
  return mu;
}
