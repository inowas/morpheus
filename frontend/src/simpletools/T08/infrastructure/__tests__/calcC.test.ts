import {calcC} from '../index';

describe('calcC', () => {
  it('calculates the value correctly', () => {
    const values = [
      [365, 0, 0.02253913043478261, 1, 0.02080361739130435, 1],
      [365, 28.799999999999994, 0.02253913043478261, 1, 0.02080361739130435, 6.49934246976791e-8],
    ];

    values.forEach(v => {
      const t = v[0];
      const x = v[1];
      const vx = v[2];
      const R = v[3];
      const DL = v[4];
      const expected = v[5];

      const result = calcC(t, x, vx, R, DL);
      expect(result).toEqual(expected);
    });
  });
});
