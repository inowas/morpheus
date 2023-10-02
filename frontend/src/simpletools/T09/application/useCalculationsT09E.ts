export function dRho(rHof: number, rHos: number): number {
  return rHof / (rHos - rHof);
}

export function calcXtQ0Flux(
  k: number,
  z0: number,
  dz: number,
  l: number,
  w: number,
  i: number,
  alpha: number,
): [number, number] {
  const qi = i * k * z0;
  const q = qi + w * l;
  const xt = q / w - Math.sqrt((q * q) / (w * w) - (k * (1 + alpha) * z0 * z0) / (w * alpha * alpha));
  const xtSlr = q / w - Math.sqrt((q * q) / (w * w) - (k * (1 + alpha) * (z0 + dz) * (z0 + dz)) / (w * alpha * alpha));
  return [xt, xtSlr];
}

export function calcXtQ0Head(
  K: number,
  z0: number,
  dz: number,
  L: number,
  W: number,
  hi: number,
  alpha: number,
): [number, number, boolean, boolean] {
  const zn = z0 + dz;
  const ht = z0 / alpha;
  const term1 = ((hi + zn) * (hi + zn) - (ht + zn) * (ht + zn)) * K / 2.0;
  let loop = true;
  let q0 = 1; // start value
  let q0Old = q0;
  let xt = 0;
  let iter = 0;
  let maxIter = false;

  let valid = true;
  do {
    if ((q0 * q0 / (W * W)) < (K * (1 + alpha) * zn * zn) / (W * alpha * alpha)) {
      valid = false;
      break;
    }

    xt = (q0 / W) - Math.sqrt((q0 * q0 / (W * W)) - (K * (1 + alpha) * zn * zn) / (W * alpha * alpha));
    q0 = (term1 / (L - xt)) + W * (L + xt) / 2;
    if (0.0000001 > Math.abs(q0Old - q0)) loop = false;
    q0Old = q0;
    iter++;
  } while (loop && 100 > iter);

  if (100 === iter) {
    maxIter = true;
  }

  return [xt, q0, maxIter, valid];
}

export function calculateDiagramData(xt: number, z0: number, xtSlr: number, dz: number, isValid: boolean) {
  if (!isValid) {
    return [{
      xt: 0,
      z0: 0,
      z0_new: 0,
    }];
  }

  return [
    {
      xt: 0,
      z0: 0,
      z0_new: dz,
    },
    {
      xt: -xt,
      z0: -z0,
      z0_new: -((z0 + dz) * (xt / xtSlr) - dz),
    },
    {
      xt: -xtSlr,
      z0_new: -z0,
    },
  ];
}
