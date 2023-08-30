import {calcX} from '../index';

describe('calcX', () => {
  it('calculates the value correctly', () => {
    const values = [
      [365, 0.02253913043478261, 1, 0.02080361739130435, 60],
      [11, 0.02253913043478261, 1.8871739130434781, 0.22180758260869565, 40],
    ];

    values.forEach(v => {
      const tMax = v[0];
      const vx = v[1];
      const R = v[2];
      const DL = v[3];
      const expected = v[4];

      const result = calcX(tMax, vx, R, DL);
      expect(result).toEqual(expected);
    });
  });
});
