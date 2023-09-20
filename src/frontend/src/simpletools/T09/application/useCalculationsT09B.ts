interface DataSet {
  x: number;
  z?: number;
  b: number;
}

export function range(start: number, stop: number, step: number) {
  let a = [start], b = start;
  while (b < stop) {
    b += step;
    a.push(b);
  }
  return a;
}

export function calculateZofX(x: number, i: number, b: number, df: number, ds: number) {
  return Math.sqrt(
    ((2 * i * b * x) / (ds - df)) + (Math.pow((i * b * df) / (ds - df), 2)),
  );
}

export function calculateDiagramData(i: number, b: number, df: number, ds: number, start: number, stop: number, step: number) {

  const xRange = range(start, stop, step);
  let data: DataSet[] = [];

  for (let ni = 0; ni < xRange.length; ni++) {
    //FIXME do we need default value in dataSet?
    let dataSet: DataSet = {x: 0, b: 0, z: 0};
    const x = xRange[ni];
    const z = calculateZofX(x, i, b, df, ds);

    dataSet.x = -x;
    if (z <= b) {
      dataSet.z = -z;
    }
    dataSet.b = -b;
    data.unshift(dataSet);
  }

  return data;
}

export function calculateZ(i: number, b: number, df: number, ds: number) {
  return (i * b * df) / (ds - df);
}

export function calculateL(i: number, b: number, df: number, ds: number) {
  return (i * b * df) / (2 * (ds - df));
}

export function calculateXT(i: number, b: number, rho_f: number, rho_s: number) {
  const frac1 = (i * b * rho_f) / (rho_s - rho_f);
  return ((b * b - frac1 * frac1) * (rho_s - rho_f)) / (2 * i * b);
}
