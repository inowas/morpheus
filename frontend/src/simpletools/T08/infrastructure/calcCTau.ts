import {erfc} from './index';

const calcCTau = (t: number, x: number, vx: number, R: number, DL: number, tau: number): number => {
  const term1 = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x - (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
  let term2 = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x + (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
  term2 = 10e-16 > Math.abs(term2) ? 0 : term2;
  return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
};
export default calcCTau;

