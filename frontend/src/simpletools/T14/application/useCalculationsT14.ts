export const erf = (x: number): number => {
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
};

export const erfc = (x: number): number => {
  return 1 - erf(x);
};

export const binomial = (n: number, k: number): number | false => {
  if ('number' !== typeof n || 'number' !== typeof k) {
    return false;
  }

  let coefficient = 1;
  for (let x = n - k + 1; x <= n; x++) {
    coefficient *= x;
  }

  for (let x = 1; x <= k; x++) {
    coefficient /= x;
  }

  return coefficient;
};

