import {calcC} from './index';

const calcT = (xMax: number, vx: number, R: number, DL: number): number => {
  let c = 0;
  let t = 0;
  while (0.9999 > c) {
    c = calcC(t, xMax, vx, R, DL);
    t = t + 20;
  }
  return t;
};
export default calcT;
