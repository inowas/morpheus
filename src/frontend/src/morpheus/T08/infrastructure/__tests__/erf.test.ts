import {erf} from '../index';

describe('test erf', () => {
  it('calculates correctly', () => {
    const result = erf(1);
    const expected = 0.8427;
    expect(+result.toFixed(4)).toBe(expected);
  });
});
