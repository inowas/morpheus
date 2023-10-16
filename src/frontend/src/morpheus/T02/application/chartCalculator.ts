import {IT02} from '../types/T02.type';

interface ICalculateChartXMax {
  variable: string;
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

interface ICalculate {
  w: number;
  L: number;
  W: number;
  hi: number;
  Sy: number;
  K: number;
  t: number;
}

interface IMounding {
  calculateHi: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
  calculateHMax: (x: number, y: number, w: number, L: number, W: number, hi: number, Sy: number, K: number, t: number) => number;
}

interface IUseChartCalculator {
  parameters: IT02['parameters'];
  mounding: IMounding;
}

const getParameterValues = (arr: IT02['parameters']) => {
  let returnValue: { [key: string]: any } = {};

  arr.forEach((item) => {
    returnValue[item.id] = item.value;
  });

  return returnValue;
};

const calculateChartXMax = ({variable, w, L, W, hi, Sy, K, t}: ICalculateChartXMax, mounding: IMounding) => {
  if ('x' === variable) {
    for (let x = 0; 10000 > x; x += 10) {

      const result = mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t);
      if (0.01 >= result) {
        return x;
      }
    }
    return 0;
  }

  for (let y = 0; 10000 > y; y += 10) {
    const result = mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t);
    if (0.01 >= result) {
      // noinspection JSSuspiciousNameCombination
      return y;
    }
  }

  return 0;
};

const calculate = ({L, W, w, hi, Sy, K, t}: ICalculate, mounding: IMounding) => {
  const xMin = 0;
  const xMax = calculateChartXMax({variable: 'x', w, L, W, hi, Sy, K, t}, mounding);
  const yMin = 0;
  const yMax = calculateChartXMax({variable: 'y', w, L, W, hi, Sy, K, t}, mounding);

  const xValues: number[] = [];
  for (let x = xMin; x < xMax; x += 10) {
    xValues.push(x);
  }

  const yValues: number[] = [];
  for (let y = yMin; y < yMax; y += 10) {
    yValues.push(y);
  }

  const zData1Q = new Array(yValues.length).fill(0).map(() => new Array(xValues.length).fill(hi));
  yValues.forEach((yValue, rowNr) => {
    xValues.forEach((xValue, colNr) => {
      zData1Q[rowNr][colNr] = mounding.calculateHi(xValue, yValue, w, L, W, hi, Sy, K, t) + hi;
    });
  });

  const xData = [...[...xValues].reverse().map(v => -v), ...xValues];
  const yData = [...[...yValues].reverse().map(v => -v), ...yValues];

  const zData12Q = zData1Q.map((row) => [...[...row].reverse(), ...row]);
  const zData = [...zData12Q.reverse(), ...zData12Q.reverse()];

  return {xData, yData, zData};
};

const chartCalculator = ({parameters, mounding}: IUseChartCalculator) => {
  console.log('chartCalculator');
  const {L, W, w, hi, Sy, K, t} = getParameterValues(parameters);
  const {xData, yData, zData} = calculate({L, W, w, hi, Sy, K, t}, mounding);
  return {L, W, xData, yData, zData};
};

export default chartCalculator;
