import erf from '../erf';

describe('test erf', () => {
  it('calculates correctly', () => {
    const result = erf({x: 1, decimals: 4});
    const expected = 0.8427;
    expect(result).toBe(expected);
  });
});
