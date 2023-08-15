import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../presentation/containers/T08Container';
import {IT08} from '../types/T08.type';

export function erf(x: number) {
  const a1: number = 0.254829592;
  const a2: number = -0.284496736;
  const a3: number = 1.421413741;
  const a4: number = -1.453152027;
  const a5: number = 1.061405429;
  const p: number = 0.3275911;

  // Save the sign of x
  let sign = 1;
  if (0 > x) {
    sign = -1;
  }
  // get absX
  const absX: number = Math.abs(x);

  // A & S 7.1.26 with Horners Method
  const t: number = 1.0 / (1.0 + p * absX);
  const y: number = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

export function erfc(x: number) {
  return 1 - erf(x);
}

export function calcC(t: number, x: number, vx: number, R: number, DL: number): number {
  const term1: number = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));
  const term2: number = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));

  return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
}

// this is for one time infiltration
export function calcCTau(t: number, x: number, vx: number, R: number, DL: number, tau: number): number {
  const term1 = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x - (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
  let term2 = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x + (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
  term2 = 10e-16 > Math.abs(term2) ? 0 : term2;
  return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
}

export function calcT(xMax: number, vx: number, R: number, DL: number): number {
  let c = 0;
  let t = 0;
  while (0.9999 > c) {
    c = calcC(t, xMax, vx, R, DL);
    t = t + 20;
  }

  return t;
}

export function calcX(tMax: number, vx: number, R: number, DL: number): number {
  let c = 1;
  let x = 0;
  while (0.0001 < c) {
    c = calcC(tMax, x, vx, R, DL);
    x = x + 20;
  }
  return x;
}

export function calculateVx(K: number, ne: number, I: number): number {
  return K * I / ne;
}

export function calculateDL(alphaL: number, vx: number) {
  return alphaL * vx;
}

export function calculateR(ne: number, Kd: number) {
  const rHob = (1 - ne) * 2.65;
  return 1 + Kd * rHob / ne;
}

export function calculateKd(kOw: number, cOrg: number) {
  const Koc = Math.exp(Math.log(kOw) - 0.21);
  return Koc * cOrg;
}

export function calculateDiagramData(settings: IT08['settings'], vx: number, DL: number, R: number, C0: number, xMax: number, tMax: number, tau: number) {
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
}
