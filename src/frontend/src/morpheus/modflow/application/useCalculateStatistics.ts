import {IObservationResult, IStatistics, ILinearRegression} from '../types/HeadObservations.type';
import sortBy from 'lodash.sortby';
import uniq from 'lodash.uniq';
import gaussian from 'gaussian';
import * as math from 'mathjs';

/**
 * Found here:
 *
 * https://stackoverflow.com/a/42594819/4908723
 */
const linearRegression = (x: number[], y: number[]): ILinearRegression => {
  const n = y.length;
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sx += x[i];
    sy += y[i];
    sxy += x[i] * y[i];
    sxx += x[i] * x[i];
    syy += y[i] * y[i];
  }
  const mx = sx / n;
  const my = sy / n;
  const yy = n * syy - sy * sy;
  const xx = n * sxx - sx * sx;
  const xy = n * sxy - sx * sy;
  const slope = xy / xx;
  const intercept = my - slope * mx;
  const r = xy / Math.sqrt(xx * yy);
  const r2 = Math.pow(r, 2);
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sst += Math.pow((y[i] - my), 2);
  }
  const sse = sst - r2 * sst;
  const see = Math.sqrt(sse / (n - 2));
  const ssr = sst - sse;
  return {
    slope: math.round(slope, 4) as number,
    intercept: math.round(intercept, 4) as number,
    r: math.round(r, 4) as number,
    r2: math.round(r2, 4) as number,
    sse: math.round(sse, 4) as number,
    ssr: math.round(ssr, 4) as number,
    sst: math.round(sst, 4) as number,
    sy: math.round(sy, 4) as number,
    sx: math.round(sx, 4) as number,
    see: math.round(see, 4) as number,
    eq: `f(x) = ${math.round(slope, 3)}x ${0 > intercept ? '-' : '+'}` +
      ` ${math.abs(math.round(intercept, 3) as number)}`,
  } as ILinearRegression;
};

const calculateNpf = (x: number, n: number) => {
  let a = 0.5;
  if (10 >= n) {
    a = 3 / 8;
  }

  const distribution = gaussian(0, 1);
  return distribution.ppf((x - a) / (n + 1 - 2 * a));
};

const calculateResidualStats = (residuals: number[], observed: number[]) => {
  const rmse = Number(math.sqrt(residuals.map((r) => r * r).reduce((a, b) => a + b) / residuals.length));
  return {
    std: Number(math.std(residuals, 'uncorrected')),
    sse: (Number(math.std(residuals, 'uncorrected')) / Number(math.sqrt(residuals.length))),
    rmse,
    nrmse: rmse / (math.max(observed) - math.min(observed)),
    max: math.max(residuals),
    mean: math.mean(residuals),
    min: math.min(residuals),
  };
};

const calculateStatistics = (data: IObservationResult[], exclude: string[] = []): IStatistics | null => {
  const recalculatedData = data
    .map((d) => ({ ...d, name: String(d.name) }))
    .filter((d) => {
      let excluded = false;
      exclude.forEach((e) => {
        if (-1 < d.name.indexOf(e)) {
          excluded = true;
        }
      });

      return !excluded;
    })
    .map((d) => ({
      ...d,
      residual: d.simulated - d.observed,
      absResidual: Math.abs(d.simulated - d.observed),
    }));

  const n = recalculatedData.length;

  if (2 > n) {
    return null;
  }

  recalculatedData.sort((a, b) => a.residual - b.residual);
  const recalculatedDataWithNpf = recalculatedData.map((d, idx) => (
    { ...d, npf: math.round(calculateNpf(idx + 1, n), 3) as number }
  ));

  recalculatedDataWithNpf.sort((a, b) => (String(a.name)).localeCompare(String(b.name)));

  return {
    names: uniq(data.map((d) => {
      let { name } = d;
      name = String(name).replace(/\d+$/, '');
      if (name.endsWith('.') || name.endsWith('_')) {
        return name.substr(0, name.length - 1);
      }

      return name;
    })).sort((a: string, b: string) => a.localeCompare(b)),
    data: recalculatedDataWithNpf,
    stats: {
      observed: {
        std: Number(math.std(recalculatedData.map((d) => d.observed), 'uncorrected')),
        z: 1.96,
        deltaStd: 1.96 * Number(math.std(recalculatedData.map((d) => d.observed), 'uncorrected')) / Number(math.sqrt(n)),
      },
      simulated: {
        std: Number(math.std(recalculatedData.map((d) => d.simulated), 'uncorrected')),
      },
      residual: calculateResidualStats(
        recalculatedData.map((d) => d.residual),
        recalculatedData.map((d) => d.observed),
      ),
      absResidual: {
        min: math.min(recalculatedData.map((d) => d.absResidual)),
        max: math.max(recalculatedData.map((d) => d.absResidual)),
        mean: math.mean(recalculatedData.map((d) => d.absResidual)),
      },
    },
    linRegObsSim: linearRegression(
      recalculatedData.map((d) => d.observed),
      recalculatedData.map((d) => d.simulated),
    ),
    linRegResSim: linearRegression(
      recalculatedData.map((d) => d.simulated),
      recalculatedData.map((d) => d.residual),
    ),
    linRegObsRResNpf: linearRegression(
      sortBy(recalculatedDataWithNpf.map((d) => d.residual), ['npf']),
      sortBy(recalculatedDataWithNpf.map((d) => d.npf), ['npf']) as number[],
    ),
  };
};

interface IUseCalculationResults {
  calculateStatistics: (data: IObservationResult[]) => IStatistics | null;
}

const useCalculationResults = (): IUseCalculationResults => {

  const calculate = (data: IObservationResult[]) => {
    return calculateStatistics(data);
  };

  return {
    calculateStatistics: calculate,
  };
};

export default useCalculationResults;
export type {IStatistics};
