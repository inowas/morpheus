const erf = (x: number) => {
  const a1: number = 0.254829592;
  const a2: number = -0.284496736;
  const a3: number = 1.421413741;
  const a4: number = -1.453152027;
  const a5: number = 1.061405429;
  const p: number = 0.3275911;

  // Save the sign of x
  let sign = 1;

  if (0 > x) {
    sign = -1;
  }
  // get absX
  const absX: number = Math.abs(x);
  // A & S 7.1.26 with Horners Method
  const t: number = 1.0 / (1.0 + p * absX);
  const y: number = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
};

export default erf;
