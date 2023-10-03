import {calcCTau} from '../index';

describe('calcCTau', () => {
  it('calculates the value correctly', () => {
    const values = [
      [365, 40.79999999999999, 0.02253913043478261, 1, 0.02080361739130435, 100, 5.551115123125783e-17],
      [365, 31.199999999999992, 0.02253913043478261, 1, 0.02080361739130435, 100, 1.878523114839936e-9],
      [365, 10, 0.02253913043478261, 1, 0.02080361739130435, 100, 0.24754936978860137],
    ];
    values.forEach(v => {
      const t = v[0];
      const x = v[1];
      const vx = v[2];
      const R = v[3];
      const DL = v[4];
      const tau = v[5];
      const expected = v[6];

      const result = calcCTau(t, x, vx, R, DL, tau);
      expect(result).toEqual(expected);
    });
  });
});
