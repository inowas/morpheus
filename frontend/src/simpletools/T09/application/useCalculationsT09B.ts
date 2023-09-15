interface IUseCalculate {
  range: (start: number, stop: number, step: number) => number[];
  calculateZofX: (x: number, i: number, b: number, df: number, ds: number) => number;
  calculateZ: (i: number, b: number, df: number, ds: number) => number;
  calculateL: (i: number, b: number, df: number, ds: number) => number;
  calculateXT: (i: number, b: number, rho_f: number, rho_s: number) => number;
  calculateDiagramData: (
    i: number,
    b: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number
  ) => DataSet[];
}

interface DataSet {
  x: number;
  z?: number;
  b: number;
}

const range = (start: number, stop: number, step: number) => {
  let a = [start], b = start;
  while (b < stop) {
    b += step;
    a.push(b);
  }
  return a;
};
const calculateZofX = (x: number, i: number, b: number, df: number, ds: number) => {
  return Math.sqrt(
    ((2 * i * b * x) / (ds - df)) + (Math.pow((i * b * df) / (ds - df), 2)),
  );
};

const useCalculationsT09B = (): IUseCalculate => ({
  range: range,
  calculateZofX: calculateZofX,
  calculateZ: (i: number, b: number, df: number, ds: number) => {
    return (i * b * df) / (ds - df);
  },
  calculateL: (i: number, b: number, df: number, ds: number) => {
    return (i * b * df) / (2 * (ds - df));
  },
  calculateXT: (i: number, b: number, rho_f: number, rho_s: number) => {
    const frac1 = (i * b * rho_f) / (rho_s - rho_f);
    return ((b * b - frac1 * frac1) * (rho_s - rho_f)) / (2 * i * b);
  },
  calculateDiagramData: (i: number, b: number, df: number, ds: number, start: number, stop: number, step: number) => {
    const xRange = range(start, stop, step);
    let data: DataSet[] = [];
    for (let ni = 0; ni < xRange.length; ni++) {
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
  },
});

export default useCalculationsT09B;
