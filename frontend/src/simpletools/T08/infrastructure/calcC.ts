import {erfc} from './index';

const calcC = (t: number, x: number, vx: number, R: number, DL: number): number => {
  const term1: number = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));
  const term2: number = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));

  return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
};
export default calcC;
