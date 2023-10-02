import {calcC} from './index';

const calcX = (tMax: number, vx: number, R: number, DL: number): number => {
  let c = 1;
  let x = 0;
  while (0.0001 < c) {
    c = calcC(tMax, x, vx, R, DL);
    x = x + 20;
  }
  return x;
};

export default calcX;
