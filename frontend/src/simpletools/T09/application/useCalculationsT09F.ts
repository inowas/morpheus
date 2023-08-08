const calcAlpha = ({w, k, df, ds}: { w: number; k: number; df: number; ds: number }): number => Math.sqrt((w * (ds - df)) / (k * ds));
const calcBeta = ({df, ds}: { df: number; ds: number }): number => df / (ds - df);

export const calcXt = ({k, z0, l, w, df, ds}: { k: number; z0: number; l: number; w: number; df: number; ds: number }): number => {
  const alpha = calcAlpha({w, k, df, ds});
  const beta = calcBeta({df, ds});

  const result = Math.sqrt(Math.pow(l, 2) - Math.pow((z0 / (alpha * beta)), 2));

  if (isNaN(result)) {
    return 0;
  }

  return result;
};

export const calcDeltaXt = ({dz, k, z0, l, w, theta, df, ds}: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }): number => {
  const alpha = calcAlpha({w, k, df, ds});
  const beta = calcBeta({df, ds});

  const result = (
    Math.sqrt(
      Math.pow(l - (dz / Math.tan(theta * Math.PI / 180)), 2) -
      Math.pow((z0 + dz) / (alpha * beta), 2),
    ) -
    Math.sqrt(
      Math.pow(l, 2) - Math.pow((z0 / (alpha * beta)), 2),
    )
  );

  if (isNaN(result)) {
    return 0;
  }

  return result;
};

export const calcNewXt = ({dz, k, z0, l, w, theta, df, ds}: { dz: number; k: number; z0: number; l: number; w: number; theta: number; df: number; ds: number }): number => {
  const xt = calcXt({k, z0, l, w, df, ds});
  const deltaXt = calcDeltaXt({dz, k, z0, l, w, theta, df, ds});
  return xt + deltaXt;
};

export const calcH = ({k, l, w, x, df, ds}: { k: number; l: number; w: number; x: number; df: number; ds: number }): number => {
  const alpha = calcAlpha({w, k, df, ds});
  return alpha * Math.sqrt(Math.pow(l, 2) - Math.pow(x, 2));
};

export const calcI = ({dz, k, l, w, theta, x, df, ds}: { dz: number; k: number; l: number; w: number; theta: number; x: number; df: number; ds: number }): number => {
  const alpha = calcAlpha({w, k, df, ds});
  const h = calcH({k, l, w, x, df, ds});
  const tanTheta = Math.tan(theta * Math.PI / 180);

  return (
    dz + Math.sqrt(
      ((-Math.pow(alpha, 2) * dz) / (tanTheta)) *
      (2 * l - (dz / tanTheta)) +
      Math.pow(h, 2),
    ) - h
  );
};
