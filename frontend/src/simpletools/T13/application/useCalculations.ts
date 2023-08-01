import {ICalculateDiagramDataT13, ICalculateDiagramDataT13B, ICalculateDiagramDataT13E} from '../types/T13.type';

export function calculateTravelTimeT13A(x: number, w: number, K: number, ne: number, L: number, hL: number, xMin: number) {
  const small = 1e-12;
  const xi = xMin;
  const alpha = L * L + K * hL * hL / w;
  const root1 = Math.sqrt(alpha / K / w);
  const root3 = Math.sqrt(1 / ((xi * xi) + small) - 1 / alpha);
  const root4 = Math.sqrt((alpha / ((xi * xi) + small)) - 1);
  const root2 = Math.sqrt(1 / (x * x) - 1 / alpha);
  const root5 = Math.sqrt((alpha / (x * x)) - 1);
  const ln = Math.log((Math.sqrt(alpha) / xi + root4) / (Math.sqrt(alpha) / x + root5));
  return ne * root1 * (x * root2 - xi * root3 + ln);
}

export function calculateTravelTimeT13B(x: number, w: number, K: number, ne: number, L1: number, h1: number, xMin: number) {
  const xi = xMin;
  const alpha = L1 * L1 + K * h1 * h1 / w;
  const root1 = Math.sqrt(alpha / K / w);
  const root3 = Math.sqrt(1 / (xi * xi) - 1 / alpha);
  const root4 = Math.sqrt((alpha / (xi * xi)) - 1);
  const root2 = Math.sqrt(1 / (x * x) - 1 / alpha);
  const root5 = Math.sqrt((alpha / (x * x)) - 1);
  const ln = Math.log((Math.sqrt(alpha) / xi + root4) / (Math.sqrt(alpha) / x + root5));
  return ne * root1 * (x * root2 - xi * root3 + ln);
}

export function calculateTravelTimeT13C(x: number, w: number, K: number, ne: number, L: number, hL: number, xMin: number) {
  const small = 1e-12;
  const xi = xMin;
  const alpha = L * L + K * hL * hL / w;
  const root1 = Math.sqrt(alpha / K / w);
  const root2 = Math.sqrt(1 / (x * x) - 1 / alpha);
  const root3 = Math.sqrt(1 / ((xi * xi) + small) - 1 / alpha);
  const root4 = Math.sqrt((alpha / ((xi * xi) + small)) - 1);
  const root5 = Math.sqrt((alpha / (x * x)) - 1);
  const ln = Math.log((Math.sqrt(alpha) / xi + root4) / (Math.sqrt(alpha) / x + root5));
  return ne * root1 * (x * root2 - xi * root3 + ln);
}

export function calculateTravelTimeT13E(xi: number, h0: number, hL: number, x: number, ne: number, Qw: number) {
  return (0.95 * h0 + 0.05 * hL) * Math.PI * (xi ** 2 - x ** 2) * ne / Qw;
}

export function calculateDiagramDataT13A({w, K, ne, L, hL, xMin, xMax, dX}: ICalculateDiagramDataT13) {
  const data = [];

  if (xMax < xMin) {
    // eslint-disable-next-line no-param-reassign
    xMax = xMin;
  }

  for (let x = xMin; x <= xMax; x += dX) {
    data.push({
      x,
      t: calculateTravelTimeT13A(x, w, K, ne, L, hL, xMin),
    });
  }
  return data;
}

export function calculateDiagramDataT13B({w, K, ne, L1, h1, xMin, xMax, dX}: ICalculateDiagramDataT13B) {
  const data = [];
  if (xMax < xMin) {
    // eslint-disable-next-line no-param-reassign
    xMax = xMin;
  }

  for (let x = xMin; x <= xMax; x += dX) {
    data.push({
      x: x,
      t: calculateTravelTimeT13B(x, w, K, ne, L1, h1, xMin),
    });
  }
  return data;
}

export function calculateDiagramDataT13C({w, K, ne, L, hL, xMin, xMax, dX}: ICalculateDiagramDataT13) {
  const data = [];
  if (xMax < xMin) {
    // eslint-disable-next-line no-param-reassign
    xMax = xMin;
  }

  for (let x = xMin; x <= xMax; x += dX) {
    data.push({
      x,
      t: calculateTravelTimeT13C(x, w, K, ne, L, hL, xMin),
    });
  }
  return data;
}

export function calculateDiagramDataT13E({Qw, ne, hL, h0, x, xi}: ICalculateDiagramDataT13E) {
  const data = [];
  for (let i = x; i <= xi; i += 10) {
    data.push({
      x: i,
      t: calculateTravelTimeT13E(i, h0, hL, x, ne, Qw),
    });
  }
  return data;
}

export function calculateXwd(L: number, K: number, w: number, hL: number, h0: number) {
  return (L / 2 + K * (hL * hL - h0 * h0) / (2 * w * L));
}

