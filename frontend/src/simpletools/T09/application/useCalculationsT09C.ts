interface IUseCalculate {
  calculateQ: (k: number, d: number, df: number, ds: number) => number;
  calculateZCrit: (d: number) => number;
  calculateZ: (q: number, k: number, d: number, df: number, ds: number) => number;
  calculateDiagramData: (
    q: number,
    k: number,
    d: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number
  ) => DataSet[];
}

interface DataSet {
  x: number;
  h: number;
}

const range = (start: number, stop: number, step: number): number[] => {
  let a = [start];
  let b = start;
  while (b < stop) {
    b += step;
    a.push(b);
  }
  return a;
};

const dRo = (df: number, ds: number): number => {
  return (ds - df) / df;
};

const calculateR = (x: number, d: number): number => {
  return x / d;
};

const calculateZ = (q: number, k: number, d: number, df: number, ds: number) => {
  return q / (2 * Math.PI * d * k * dRo(df, ds));
};

const calculateZofX = (x: number, q: number, d: number, k: number, ds: number, df: number): number => {
  return (
    1 /
    (Math.sqrt(Math.pow(calculateR(x, d), 2) + 1)) -
    1 /
    (Math.sqrt(Math.pow(calculateR(x, d), 2) + Math.pow(1 + calculateT(df, ds, k, d), 2)))
  ) * calculateZ(q, k, d, df, ds);
};

const calculateT = (df: number, ds: number, k: number, d: number): number => {
  const t = 1000000000;
  const n = 0.25;
  const deltaS = dRo(df, ds);
  return (deltaS * k * t) / (n * d * (2 + deltaS));
};

const useCalculationsT09C = (): IUseCalculate => ({
  calculateZ: calculateZ,
  calculateQ: (k: number, d: number, df: number, ds: number) => {
    return 0.6 * Math.PI * d * d * k * dRo(df, ds);
  },
  calculateZCrit: (d: number) => {
    return 0.3 * d;
  },
  calculateDiagramData: (q: number,
    k: number,
    d: number,
    df: number,
    ds: number,
    start: number,
    stop: number,
    step: number) => {
    const xRange = range(start, stop, step);
    let data: DataSet[] = [];
    for (let i = 0; i < xRange.length; i++) {
      let dataSet: DataSet = {x: 0, h: 0};
      const x = xRange[i];
      const h = calculateZ(q, k, d, df, ds);
      dataSet.x = Number(x);
      dataSet.h = calculateZofX(x, q, d, k, ds, df);
      data.push(dataSet);
    }
    return data;
  },
});

export default useCalculationsT09C;
