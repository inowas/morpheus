import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../presentation/containers/T08Container';
import {calcC, calcCTau, calcT, calcX} from '../infrastructure';

import {IT08} from '../types/T08.type';

interface IUseCalculate {
  calcC: (t: number, x: number, vx: number, R: number, DL: number) => number;
  calcCTau: (t: number, x: number, vx: number, R: number, DL: number, tau: number) => number;
  calculateVx: (K: number, ne: number, I: number) => number;
  calculateDL: (alphaL: number, vx: number) => number;
  calculateR: (ne: number, Kd: number) => number;
  calculateDiagramData: (
    settings: IT08['settings'],
    vx: number,
    DL: number,
    R: number,
    C0: number,
    xMax: number,
    tMax: number,
    tau: number
  ) => any[];
}

const useCalculate = (): IUseCalculate => ({
  calcC: calcC,
  calcCTau: calcCTau,
  calculateVx: (K: number, ne: number, I: number): number => {
    return K * I / ne;
  },
  calculateDL: (alphaL: number, vx: number) => {
    return alphaL * vx;
  },
  calculateR: (ne: number, Kd: number) => {
    const rHob = (1 - ne) * 2.65;
    return 1 + Kd * rHob / ne;
  },
  calculateDiagramData: (settings: IT08['settings'], vx: number, DL: number, R: number, C0: number, xMax: number, tMax: number, tau: number) => {
    let tauMax = 10e+8;
    if (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME) {
      tauMax = tau;
    }
    const data = [];
    if (settings.case === SETTINGS_CASE_VARIABLE_TIME) {
      const x = xMax;
      tMax = calcT(xMax, vx, R, DL);

      let dt = Math.floor(tMax / 25);

      //let tStart = tMax - dt * 25;
      if (1 > dt) {
        //tStart = 1;
        dt = 1;
      }

      for (let t = 0; t <= tMax; t += dt) {
        if (t < tauMax) {
          data.push({
            t: t,
            C: calcC(t, x, vx, R, DL),
          });
        } else {
          data.push({
            t: t,
            C: calcCTau(t, x, vx, R, DL, tau),
          });
        }
      }
    }
    if (settings.case === SETTINGS_CASE_FIXED_TIME) {
      const t = tMax;
      xMax = calcX(tMax, vx, R, DL);
      let dx = xMax / 25;

      //let xStart = xMax - dx * 25;
      if (1 > dx) {
        //xStart = 1;
        dx = 1;
      }
      for (let x = 0; x <= xMax; x += dx) {
        if (t < tauMax) {
          data.push({
            x: x,
            C: calcC(t, x, vx, R, DL),
          });
        } else {
          data.push({
            x: x,
            C: calcCTau(t, x, vx, R, DL, tau),
          });
        }
      }
    }
    return data;
  },
});

export default useCalculate;
