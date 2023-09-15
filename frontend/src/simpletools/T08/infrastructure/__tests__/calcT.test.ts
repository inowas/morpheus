import {calcT} from '../index';

describe('calcT', () => {
  it('calculates the value correctly', () => {
    const values = [
      [10, 0.02253913043478261, 1, 0.02080361739130435, 1780],
      [45, 0.8643217391304349, 1, 0.7977689652173914, 140],
    ];

    values.forEach(v => {
      const xMax = v[0];
      const vx = v[1];
      const R = v[2];
      const DL = v[3];
      const expected = v[4];

      const result = calcT(xMax, vx, R, DL);
      expect(result).toEqual(expected);
    });
  });
});
