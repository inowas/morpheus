interface IUseCalculations {
  mounding: {
    calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
    calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  };
}

const numericallyIntegrate = (a: number, b: number, dx: number, f: (x: number) => number): number => {
  // define the variable for area
  let area = 0;

  // loop to calculate the area of each trapezoid and sum.
  for (let x1 = a + dx; x1 <= b; x1 += dx) {
    // the x locations of the left and right side of each trapezoid
    const x0 = x1 - dx;

    // the area of each trapezoid
    const Ai = dx * (f(x0) + f(x1)) / 2.0;

    // cumulatively sum the areas
    area += Ai;
  }

  return area;
};

const erf = (x: number, decimals = 7): number => {
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
  return sign * y;
};


const S = (alpha: number, beta: number) => {
  const func = (tau: number) => {
    if (0 !== tau) {
      const sqrtTau = Math.sqrt(tau);
      return erf(alpha / sqrtTau) * erf(beta / sqrtTau);
    }

    return 0;
  };

  return numericallyIntegrate(0, 1, 0.001, func);
};

const calculateHi = (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => {
  const a = W / 2;
  const l = L / 2;
  const v = K * hi / Sy;
  const sqrt4vt = Math.sqrt(4 * v * t);

  const s1 = S((l + x) / sqrt4vt, (a + y) / sqrt4vt);
  const s2 = S((l + x) / sqrt4vt, (a - y) / sqrt4vt);
  const s3 = S((l - x) / sqrt4vt, (a + y) / sqrt4vt);
  const s4 = S((l - x) / sqrt4vt, (a - y) / sqrt4vt);

  return Math.sqrt(w / 2 / K * v * t * (s1 + s2 + s3 + s4) + hi * hi) - hi;
};

const calculateHMax = (w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => {
  return calculateHi(0, 0, w, L, W, hi, Sy, K, t) + hi;
};


const useCalculations = (): IUseCalculations => ({
  mounding: {
    calculateHi,
    calculateHMax,
  },
});

export default useCalculations;

