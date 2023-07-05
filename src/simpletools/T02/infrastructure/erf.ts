type IErf = (input: IErfInput) => number;

interface IErfInput {
  x: number;
  decimals?: number;
}

const erf = ({x, decimals = 7}: IErfInput): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  let sign = 1;

  if (0 > x) sign = -1;

  const absX = Math.abs(x);
  // A & S 7.1.26 with Horners Method
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return parseFloat((sign * y).toFixed(decimals));
};

export default erf;
export type {IErf};
