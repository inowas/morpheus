import S from './S';

interface ICalculateMounding {
  x: number;
  y: number;
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

const calculateHi = ({x, y, w, L, W, hi, Sy, K, t}: ICalculateMounding) => {
  const a = W / 2;
  const l = L / 2;
  const v = K * hi / Sy;
  const sqrt4vt = Math.sqrt(4 * v * t);
  const s1 = S({alpha: (l + x) / sqrt4vt, beta: (a + y) / sqrt4vt});
  const s2 = S({alpha: (l + x) / sqrt4vt, beta: (a - y) / sqrt4vt});
  const s3 = S({alpha: (l - x) / sqrt4vt, beta: (a + y) / sqrt4vt});
  const s4 = S({alpha: (l - x) / sqrt4vt, beta: (a - y) / sqrt4vt});

  return Math.sqrt(w / 2 / K * v * t * (s1 + s2 + s3 + s4) + hi * hi) - hi;
};

export default calculateHi;
export type {ICalculateMounding};
